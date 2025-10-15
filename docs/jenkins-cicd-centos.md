# CI/CD với Jenkins trên CentOS (GitHub ➜ Jenkins ➜ Docker Compose)

Tài liệu này hướng dẫn thiết lập CI/CD cho dự án Node.js này trên máy chủ CentOS dùng Jenkins và GitHub Webhook. Pipeline sẽ:

- Nhận webhook từ GitHub khi có push/PR
- Build Docker image của ứng dụng
- Chạy test (Jest) bên trong image
- Deploy bằng `docker compose` trên cùng máy Jenkins

## Kiến trúc luồng

GitHub (webhook) ➜ Jenkins (Pipeline) ➜ Docker Engine + Docker Compose ➜ Container chạy app tại cổng 3000

## Yêu cầu

- Máy chủ CentOS 7/Stream 8/9 với quyền sudo
- Tên miền/IP có thể truy cập cổng Jenkins (mặc định 8080)
- Repo GitHub của bạn chứa file `Jenkinsfile` (đã thêm)

## 1) Cài Java, Jenkins, Git

```bash
# Java 17 (Jenkins LTS hỗ trợ tốt)
sudo dnf install -y java-17-openjdk || sudo yum install -y java-17-openjdk

# Thêm repo Jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# Cài Jenkins + Git
sudo dnf install -y jenkins git || sudo yum install -y jenkins git

# Khởi động Jenkins và bật tự khởi động
sudo systemctl enable --now jenkins

# Lấy mật khẩu admin lần đầu
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Mở trình duyệt tới: `http://<IP-hoặc-domain>:8080` ➜ nhập mật khẩu trên ➜ Install suggested plugins.

## 2) Cài Docker Engine + Docker Compose plugin

```bash
# Thêm repo Docker
sudo dnf -y install dnf-plugins-core || sudo yum -y install yum-utils
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo \
  || sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Cài Docker + Compose plugin
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin \
  || sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Khởi động Docker
sudo systemctl enable --now docker

# Kiểm tra
docker version
docker compose version
```

## 3) Cho phép Jenkins dùng Docker

```bash
# Thêm user jenkins vào nhóm docker
sudo usermod -aG docker jenkins

# (Tùy chọn) Cấp quyền tạm thời cho socket nếu cần
# sudo setfacl -m u:jenkins:rw /var/run/docker.sock

# Khởi động lại Jenkins để nhận group mới
sudo systemctl restart jenkins
```

Kiểm tra user `jenkins` đã thuộc group `docker`:

```bash
id jenkins | grep docker
```

## 4) Mở tường lửa và cấu hình SELinux (nếu bật)

```bash
# Mở cổng 8080 cho Jenkins
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload

# Nếu SELinux Enforcing, cho phép port 8080
sudo dnf install -y policycoreutils-python-utils || sudo yum install -y policycoreutils-python
sudo semanage port -a -t http_port_t -p tcp 8080 || sudo semanage port -m -t http_port_t -p tcp 8080
```

Khuyến nghị dùng reverse proxy (Nginx) + TLS nếu công khai ra internet.

## 5) Cài plugin Jenkins cần thiết

Manage Jenkins ➜ Plugins:

- Git, Git client
- GitHub, GitHub Integration
- Pipeline, Pipeline: GitHub Groovy Libraries
- Docker, Docker Pipeline
- (Tuỳ chọn) Blue Ocean, Generic Webhook Trigger

Trong Manage Jenkins ➜ System: đặt Jenkins URL (ví dụ `http://your-domain:8080/`).

## 6) Chuẩn bị repo và Jenkinsfile

Repo này đã có `Jenkinsfile` với các stage:

- Checkout
- Build Docker image (`web_ban_hang:<BUILD_NUMBER>` và `latest`)
- Test (`npm test` chạy trong container)
- Deploy bằng `docker compose up -d --build` (branch `main`)

Lưu ý: Dockerfile hiện dùng `npm install` (đã đủ cho devDependencies để chạy Jest). Compose publish port `3000:3000`.

Ghi chú về test: file `tests/AdminController.test.mjs` có thể cần chỉnh đường dẫn import cho phù hợp cấu trúc thư mục thực tế (`controllers/` thay vì `src/controllers/`). Nếu test fail do import sai, bạn có thể tạm thời skip stage Test hoặc sửa test cho đúng trước khi bật CI.

## 7) Tạo Pipeline job từ SCM

- New Item ➜ Pipeline (hoặc Multibranch Pipeline nếu muốn build nhiều nhánh/PR)
- Tên: `Web_ban_hang_DevOps`
- Pipeline script from SCM
  - SCM: Git
  - Repository URL: `https://github.com/<owner>/Web_ban_hang_DevOps.git`
  - Credentials: (thêm nếu repo private; dùng PAT hoặc SSH)
  - Branches to build: `*/main`
  - Script Path: `Jenkinsfile`
- Build Triggers: tick "GitHub hook trigger for GITScm polling"
- Lưu lại

## 8) Kết nối Webhook GitHub

Trong GitHub repo:

- Settings ➜ Webhooks ➜ Add webhook
  - Payload URL: `http://<jenkins-domain-or-ip>:8080/github-webhook/`
  - Content type: `application/json`
  - Secret: để trống hoặc đặt secret và cấu hình trong Jenkins
  - Just the push event (hoặc thêm PR events nếu dùng Multibranch)
- Add webhook và test delivery (Expect 200 OK)

Khi push code lên `main`, Jenkins sẽ tự build và deploy.

## 9) Deploy và kiểm tra

Jenkins stage "Deploy" sẽ chạy:

```bash
docker compose -f docker-compose.yml down || true
docker compose -f docker-compose.yml up -d --build
```

Bạn có thể truy cập ứng dụng tại: `http://<server-ip>:3000`

## 10) Gỡ lỗi nhanh

- Jenkins không gọi được Docker: `id jenkins` phải có group `docker`; restart Jenkins sau khi thêm group.
- `docker compose` không có: cài `docker-compose-plugin` hoặc dùng `docker-compose` binary, và sửa Jenkinsfile tương ứng.
- Webhook không bắn: firewall/NAT, Jenkins URL, hoặc repo private cần credentials. Xem GitHub webhook deliveries.
- SELinux chặn: kiểm tra `audit.log`, xem xét `semanage port` hoặc tạm thời `setenforce 0` (không khuyến nghị lâu dài).
- Port 3000 đang bận: đổi mapping trong `docker-compose.yml`.

## 11) Nâng cao (tùy chọn)

- Push image lên registry (Docker Hub/Harbor):
  - Thêm credentials Docker vào Jenkins.
  - Trong Jenkinsfile thêm stage `docker login` + `docker push`.
  - Compose chỉ dùng `image:` không `build:` để triển khai image đã push.
- Tách môi trường dev/stage/prod bằng nhiều compose file.
- Thêm kiểm tra/lint, cache Docker build, thông báo Slack.

## Ghi chú

- `package.json` khai báo `packageManager: yarn@4`, nhưng Dockerfile dùng npm. Điều này vẫn hoạt động do có `package-lock.json`. Nếu muốn đồng bộ, chuyển sang yarn trong Dockerfile.

---

Sau khi hoàn tất, mọi lần bạn push lên nhánh `main`, Jenkins sẽ tự động build, test và deploy lên máy CentOS thông qua Docker Compose.

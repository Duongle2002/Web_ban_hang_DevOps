# Hướng dẫn đóng gói Docker và chạy trên CentOS

Tài liệu này mô tả cách build image Docker trên máy dev (Windows), export sang file .tar, chuyển sang máy CentOS, import và chạy container. Cũng bao gồm ví dụ systemd để chạy container như một service.

1) Trên máy dev (Windows) — build image

```powershell
# build image
docker build -t web_ban_hang:latest .

# kiểm tra image
docker images | Select-String web_ban_hang

# xuất image ra file tar (để copy tới CentOS)
docker save -o web_ban_hang_latest.tar web_ban_hang:latest
```

2) Copy file `web_ban_hang_latest.tar` tới máy CentOS (scp/sftp)

```bash
# từ máy dev (PowerShell):
scp ./web_ban_hang_latest.tar user@centos-host:/home/user/
```

3) Trên CentOS — load image và chạy

```bash
# load image
sudo docker load -i /home/user/web_ban_hang_latest.tar

# chạy container (background)
sudo docker run -d --name web_ban_hang -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGO_URI='mongodb://mongo:27017/yourdb' \
  web_ban_hang:latest

# xem logs
sudo docker logs -f web_ban_hang
```

4) Tạo systemd service để container auto-start (ví dụ: `/etc/systemd/system/web_ban_hang.service`)

```ini
[Unit]
Description=Web_ban_hang Docker container
After=docker.service
Requires=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker run --rm --name web_ban_hang -p 3000:3000 -e NODE_ENV=production web_ban_hang:latest
ExecStop=/usr/bin/docker stop -t 2 web_ban_hang

[Install]
WantedBy=multi-user.target
```

Enable và start service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now web_ban_hang.service
sudo journalctl -u web_ban_hang -f
```

5) SELinux & Firewall notes

- Nếu SELinux bật, khi bind port hoặc mount volume bạn có thể cần setenforce 0 để thử (không khuyến nghị cho production) hoặc chỉnh context SELinux chính xác.
- Mở port 3000 trên firewall nếu cần:

```bash
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

6) Troubleshooting

- Nếu package native (bcrypt) gặp lỗi khi cài trên image musl (alpine), ta đã chuyển sang `node:18-slim` trong Dockerfile để tránh vấn đề này.
- Kiểm tra `docker logs` để xem lỗi runtime.

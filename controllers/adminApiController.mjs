import bcrypt from 'bcrypt'
import UserService from '../services/UserService.mjs'
import ProductService from '../services/ProductService.mjs'
import BlogService from '../services/BlogService.mjs'

const ok = (res, data) => res.status(200).json(data)
const created = (res, data) => res.status(201).json(data)
const notFound = (res, msg='Not found') => res.status(404).json({ message: msg })
const bad = (res, msg) => res.status(400).json({ message: msg })

// Users
export const listUsers = async (req, res) => {
  const users = await UserService.getUsers()
  return ok(res, { users })
}
export const getUser = async (req, res) => {
  const u = await UserService.getUserById(req.params.id)
  if(!u) return notFound(res, 'User not found')
  return ok(res, u)
}
export const createUser = async (req, res) => {
  const { name, email, password, role, age } = req.body
  if(!email) return bad(res, 'Email is required')
  const data = { name, email, role: role || 'User', age: age? parseInt(age): undefined }
  if(password) data.password = await bcrypt.hash(password, 10)
  const u = await UserService.createUser(data)
  return created(res, u)
}
export const updateUser = async (req, res) => {
  const { name, email, password, role, age } = req.body
  const data = { name, email, role, age: age? parseInt(age): undefined }
  if(password) data.password = await bcrypt.hash(password, 10)
  await UserService.updateUser(req.params.id, data)
  return ok(res, { message: 'Updated' })
}
export const deleteUser = async (req, res) => {
  await UserService.deleteUser(req.params.id)
  return ok(res, { message: 'Deleted' })
}

// Products
export const listProducts = async (req, res) => {
  const q = req.query.q || ''
  const products = await ProductService.searchProducts(q)
  return ok(res, { products })
}
export const getProduct = async (req, res) => {
  const p = await ProductService.getProductById(req.params.id)
  if(!p) return notFound(res, 'Product not found')
  return ok(res, p)
}
export const createProduct = async (req, res) => {
  const { name, category, price, originalPrice, sale, newArrival, bestSeller } = req.body
  if(!name || !price) return bad(res, 'Name and price are required')
  const image = req.file ? `/images/${req.file.filename}` : ''
  const productData = {
    name,
    category,
    price: parseFloat(price),
    originalPrice: originalPrice? parseFloat(originalPrice): undefined,
    image,
    sale: sale === 'on' || sale === true,
    newArrival: newArrival === 'on' || newArrival === true,
    bestSeller: bestSeller === 'on' || bestSeller === true
  }
  const p = await ProductService.createProduct(productData)
  return created(res, p)
}
export const updateProduct = async (req, res) => {
  const { name, category, price, originalPrice, sale, newArrival, bestSeller, existingImage } = req.body
  const image = req.file ? `/images/${req.file.filename}` : existingImage
  const data = {
    name,
    category,
    price: price? parseFloat(price): undefined,
    originalPrice: originalPrice? parseFloat(originalPrice): undefined,
    image,
    sale: sale === 'on' || sale === true,
    newArrival: newArrival === 'on' || newArrival === true,
    bestSeller: bestSeller === 'on' || bestSeller === true
  }
  await ProductService.updateProduct(req.params.id, data)
  return ok(res, { message: 'Updated' })
}
export const deleteProduct = async (req, res) => {
  await ProductService.deleteProduct(req.params.id)
  return ok(res, { message: 'Deleted' })
}

// Blogs
export const listBlogs = async (req, res) => {
  const q = req.query.q || ''
  const blogs = await BlogService.searchBlogs(q)
  return ok(res, { blogs })
}
export const getBlog = async (req, res) => {
  try{ const b = await BlogService.getBlogById(req.params.id); return ok(res, b) }catch(e){ return notFound(res, 'Blog not found') }
}
export const createBlog = async (req, res) => {
  const { title, description, content } = req.body
  if(!title || !content) return bad(res, 'Title and content are required')
  const image = req.file ? `/images/${req.file.filename}` : ''
  const b = await BlogService.createBlog({ title, description, image, content })
  return created(res, b)
}
export const updateBlog = async (req, res) => {
  const { title, description, content, existingImage } = req.body
  const image = req.file ? `/images/${req.file.filename}` : existingImage
  await BlogService.updateBlog(req.params.id, { title, description, image, content })
  return ok(res, { message: 'Updated' })
}
export const deleteBlog = async (req, res) => {
  await BlogService.deleteBlog(req.params.id)
  return ok(res, { message: 'Deleted' })
}

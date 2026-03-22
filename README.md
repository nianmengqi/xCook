# xCook - 家庭菜谱管理系统

一款功能完善的家庭菜谱管理应用，支持菜品图片管理、结构化菜谱编辑、营养成分计算、每日菜单规划等功能。

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-数据库-blue?logo=sqlite)
![Docker](https://img.shields.io/badge/Docker-支持-blue?logo=docker)

## ✨ 功能特性

### 🍳 核心功能
- **菜谱管理** - 创建、编辑、删除、查看菜谱，支持富文本步骤
- **图片处理** - 图片上传、裁剪、压缩、预览
- **营养计算** - 基于中国食物成分表自动计算营养成分
- **每日菜单** - 规划每日饮食，自动汇总热量和食材清单
- **分类管理** - 按菜系、类型、场景分类
- **收藏功能** - 收藏喜欢的菜谱
- **评分系统** - 为菜谱评分

### 🔐 用户系统
- **用户注册/登录** - 安全的身份认证
- **个人中心** - 管理个人菜谱和收藏
- **管理员功能** - 营养数据管理

### 📱 技术特性
- **响应式设计** - 完美适配移动端和桌面端
- **安全认证** - JWT Token + bcrypt 密码加密
- **请求限流** - 防止暴力破解和滥用
- **文件安全** - 文件类型验证、路径遍历防护
- **数据持久化** - SQLite 轻量级数据库

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 样式方案 | Tailwind CSS |
| 状态管理 | React Context |
| 路由管理 | React Router v6 |
| 后端框架 | Express.js |
| 数据库 | SQLite (sql.js) |
| 认证方案 | JWT + bcrypt |
| 构建工具 | Vite |
| 容器化 | Docker + Docker Compose |

## 📁 项目结构

```
xcook/
├── src/                        # 前端源码
│   ├── components/             # 组件
│   ├── pages/                  # 页面
│   ├── context/                # 状态管理
│   ├── services/               # API 服务
│   └── utils/                  # 工具函数
│
├── server/                     # 后端源码
│   ├── src/
│   │   ├── routes/             # API 路由
│   │   ├── middleware/         # 中间件
│   │   └── db/                 # 数据库
│   ├── data/                   # SQLite 数据库
│   └── uploads/                # 上传文件
│
├── Dockerfile                  # Docker 构建文件
├── docker-compose.yml          # Docker Compose 配置
└── .env.example                # 环境变量模板
```

---

## 🚀 部署指南

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+

### 第一步：获取代码

```bash
# 克隆项目
git clone https://github.com/your-repo/xcook.git
cd xcook
```

### 第二步：配置环境变量

创建 `.env` 文件：

```bash
# 创建配置文件
cat > .env << 'EOF'
# 管理员密码（用于营养数据管理）
ADMIN_PASSWORD=your-admin-password

# JWT 密钥（建议设置，否则每次重启用户需重新登录）
# 可使用以下命令生成：node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-random-secret-key-at-least-64-characters-long

# 允许的跨域来源（多个用逗号分隔，可选）
CORS_ORIGINS=https://your-domain.com
EOF
```

**环境变量说明：**

| 变量 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `ADMIN_PASSWORD` | 管理员密码（明文） | 否 | `admin123` |
| `JWT_SECRET` | JWT 密钥（建议设置） | 否 | 自动生成 |
| `CORS_ORIGINS` | 允许的跨域来源 | 否 | - |

### 第三步：启动服务

```bash
# 构建并启动（后台运行）
docker-compose up -d

# 查看启动日志
docker-compose logs -f
```

### 第四步：验证部署

```bash
# 检查服务状态
docker-compose ps

# 健康检查
curl http://localhost:3000/api/health
```

访问 **http://localhost:3000** 开始使用。

---

## 📋 常用命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看状态
docker-compose ps
```

### 更新部署

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

### 进入容器

```bash
# 进入容器终端
docker exec -it xcook sh

# 查看后端日志
docker exec -it xcook cat /app/server/logs/app.log
```

---

## 💾 数据备份与恢复

### 备份数据

```bash
# 创建备份目录
mkdir -p backup

# 备份数据库
docker run --rm \
  -v xcook-data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/xcook-data-$(date +%Y%m%d).tar.gz /data

# 备份上传文件
docker run --rm \
  -v xcook-uploads:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/xcook-uploads-$(date +%Y%m%d).tar.gz /data
```

### 恢复数据

```bash
# 恢复数据库
docker run --rm \
  -v xcook-data:/data \
  -v $(pwd)/backup:/backup \
  alpine sh -c "cd / && tar xzf /backup/xcook-data-backup.tar.gz"

# 恢复上传文件
docker run --rm \
  -v xcook-uploads:/data \
  -v $(pwd)/backup:/backup \
  alpine sh -c "cd / && tar xzf /backup/xcook-uploads-backup.tar.gz"
```

---

## 🔧 高级配置

### 自定义端口

修改 `docker-compose.yml`：

```yaml
services:
  xcook:
    ports:
      - "8080:3000"  # 改为 8080 端口
```

### 使用外部 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 文件上传大小限制
        client_max_body_size 10M;
    }
}
```

### HTTPS 配置（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## 📖 主要页面

| 路由 | 说明 |
|------|------|
| `/` | 首页 - 菜谱列表 |
| `/login` | 登录页 |
| `/register` | 注册页 |
| `/recipe/new` | 创建菜谱 |
| `/recipe/:id` | 菜谱详情 |
| `/recipe/:id/edit` | 编辑菜谱 |
| `/favorites` | 收藏列表 |
| `/categories` | 分类管理 |
| `/daily-menu` | 每日菜单 |
| `/admin/nutrition` | 营养数据管理（需管理员权限） |

---

## 🔌 API 接口

### 认证接口
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户

### 菜谱接口
- `GET /api/recipes` - 获取菜谱列表
- `GET /api/recipes/:id` - 获取菜谱详情
- `POST /api/recipes` - 创建菜谱
- `PUT /api/recipes/:id` - 更新菜谱
- `DELETE /api/recipes/:id` - 删除菜谱
- `POST /api/recipes/:id/rate` - 评分
- `POST /api/recipes/:id/favorite` - 收藏/取消收藏

### 每日菜单接口
- `GET /api/daily-menu` - 获取每日菜单
- `POST /api/daily-menu` - 保存每日菜单
- `DELETE /api/daily-menu` - 删除每日菜单

### 营养数据接口
- `GET /api/nutrition` - 获取所有食材
- `GET /api/nutrition/search?q=keyword` - 搜索食材
- `POST /api/nutrition/admin/login` - 管理员登录

---

## 🔒 安全特性

- **JWT 认证** - 安全的用户身份验证
- **bcrypt 哈希** - 密码加密存储
- **请求限流** - 防止暴力破解
- **helmet 中间件** - 安全 HTTP 头
- **输入验证** - 防止注入攻击
- **文件验证** - 魔数验证、路径遍历防护
- **CORS 配置** - 跨域访问控制

---

## 🛠 开发指南

### 本地开发

```bash
# 安装依赖
npm install
cd server && npm install && cd ..

# 配置环境变量
cp .env.example .env
cp server/.env.example server/.env

# 启动后端（终端1）
cd server && npm run dev

# 启动前端（终端2）
npm run dev
```

### 前端命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

### 后端命令

```bash
cd server
npm run dev      # 启动开发服务器（热重载）
npm run build    # 编译 TypeScript
npm start        # 启动生产服务器
```

---

## ❓ 常见问题

### 1. 端口被占用

```bash
# 查看端口占用
lsof -i :3000

# 修改 docker-compose.yml 中的端口映射
```

### 2. 容器无法启动

```bash
# 查看详细日志
docker-compose logs xcook

# 重新构建
docker-compose up -d --build --force-recreate
```

### 3. 数据丢失

确保使用 Docker 数据卷持久化数据：
- `xcook-data`: 数据库文件
- `xcook-uploads`: 上传的图片

### 4. 忘记管理员密码

修改 `.env` 文件中的 `ADMIN_PASSWORD`，然后重启服务：

```bash
docker-compose restart
```

---

## 📝 更新日志

### v1.1.0
- ✨ 新增每日菜单功能
- ✨ 新增食材清单汇总
- 🐛 修复移动端图片裁剪问题
- 🐛 修复登录错误提示显示问题
- 💄 优化营养数据管理页面布局

### v1.0.0
- 🎉 初始版本发布
- ✨ 菜谱管理功能
- ✨ 营养计算功能
- ✨ 用户认证系统

---

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- 营养数据来源：中国食物成分表
- 图标：Heroicons
- UI 框架：Tailwind CSS

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

----
## 项目预览
<img width="1718" height="771" alt="Snipaste_2026-03-22_21-52-48" src="https://github.com/user-attachments/assets/78b55949-f9e4-44ab-a78f-e61c1e90bb17" />

<img width="1654" height="1202" alt="Snipaste_2026-03-22_21-53-20" src="https://github.com/user-attachments/assets/96a76852-1f3b-468b-ab6b-3d418bf13cb7" />
<img width="1781" height="1227" alt="Snipaste_2026-03-22_21-53-31" src="https://github.com/user-attachments/assets/c0476d1d-788f-4b09-9302-429cbf9e38f1" />
<img width="1674" height="1081" alt="Snipaste_2026-03-22_21-53-42" src="https://github.com/user-attachments/assets/8d0beff1-32ad-412c-bc66-7406e3f8635e" />
<img width="1722" height="1196" alt="Snipaste_2026-03-22_21-54-02" src="https://github.com/user-attachments/assets/12d82ab8-beaa-44d3-bb14-0f422d4825ec" />
<img width="970" height="911" alt="Snipaste_2026-03-22_21-54-09" src="https://github.com/user-attachments/assets/5619c67d-6476-4fd2-91c5-eb8c9385a2e3" />
<img width="1880" height="995" alt="Snipaste_2026-03-22_21-54-19" src="https://github.com/user-attachments/assets/f5e8dd51-3ed8-4f79-90db-2499ee504d1b" />

<img width="1717" height="908" alt="Snipaste_2026-03-22_21-54-24" src="https://github.com/user-attachments/assets/f833e080-6979-4970-b0e0-273a710afed9" />

<img width="516" height="1135" alt="image" src="https://github.com/user-attachments/assets/be5f20e9-8360-4e59-b8f3-6b0fb908c82f" />

---

## 🚀 部署指南

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+（可选）

---

### ⭐ 方式一：Docker Hub 一键部署（推荐）

最简单的方式，无需克隆代码，直接从 Docker Hub 拉取镜像运行：

```bash
# 一行命令启动
docker run -d \
  --name xcook \
  -p 3000:3000 \
  -e ADMIN_PASSWORD=xcook123456 \
  xcook/xcook:latest
```

**或使用 Docker Compose：**

```bash
# 创建配置文件
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  xcook:
    image: xcook/xcook:latest
    ports:
      - "3000:3000"
    environment:
      - ADMIN_PASSWORD=xcook123456
    volumes:
      - xcook-data:/app/server/data
      - xcook-uploads:/app/server/uploads
    restart: unless-stopped
volumes:
  xcook-data:
  xcook-uploads:
EOF

# 启动服务
docker-compose up -d
```

**部署参数说明：**

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-p 3000:3000` | 端口映射 | 3000:3000 |
| `ADMIN_PASSWORD` | 管理员密码 | xcook123456 |
| `JWT_SECRET` | JWT 密钥（留空自动生成） | 自动生成 |

---

### 方式二：Docker 命令部署（本地构建）

#### 第一步：获取代码

```bash
git clone https://github.com/nianmengqi/xCook.git
cd xCook
```

#### 第二步：构建镜像

```bash
docker build -t xcook:latest .
```

#### 第三步：启动容器

```bash
docker run -d \
  --name xcook \
  -p 3000:3000 \
  -v xcook-data:/app/server/data \
  -v xcook-uploads:/app/server/uploads \
  -e JWT_SECRET=$(openssl rand -hex 64) \
  -e ADMIN_PASSWORD=admin123 \
  --restart unless-stopped \
  xcook:latest
```

**参数说明：**

| 参数 | 说明 |
|------|------|
| `-p 3000:3000` | 端口映射，格式为 `宿主机端口:容器端口` |
| `-v xcook-data` | 数据库持久化存储 |
| `-v xcook-uploads` | 上传文件持久化存储 |
| `-e JWT_SECRET` | JWT 密钥，建议使用随机字符串 |
| `-e ADMIN_PASSWORD` | 管理员密码 |
| `-e CORS_ORIGINS` | 跨域来源（可选，多个用逗号分隔） |

#### 第四步：验证部署

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs xcook

# 健康检查
curl http://localhost:3000/health
```

---

### 方式三：Docker Compose 部署

#### 第一步：创建配置文件

```bash
cat > .env << 'EOF'
# 服务端口（宿主机端口）
PORT=3000

# JWT 密钥（建议生成随机字符串）
JWT_SECRET=your-jwt-secret-key

# 管理员密码
ADMIN_PASSWORD=admin123

# 跨域来源（可选，多个用逗号分隔）
CORS_ORIGINS=
EOF
```

生成 JWT 密钥：

```bash
# 方式一：使用 openssl
openssl rand -hex 64

# 方式二：使用 node
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 第二步：启动服务

```bash
docker-compose up -d --build
```

#### 第三步：验证部署

```bash
docker-compose ps
curl http://localhost:3000/health
```

---

### 自定义端口

如果 3000 端口被占用，可以映射到其他端口：

```bash
# 映射到 3001 端口
docker run -d \
  --name xcook \
  -p 3001:3000 \
  -v xcook-data:/app/server/data \
  -v xcook-uploads:/app/server/uploads \
  -e JWT_SECRET=$(openssl rand -hex 64) \
  -e ADMIN_PASSWORD=admin123 \
  --restart unless-stopped \
  xcook:latest

# 访问地址变为 http://localhost:3001
```

或修改 `.env` 文件：

```bash
PORT=3001
```

---

### 环境变量说明

| 变量 | 说明 | 必填 | 默认值 |
|------|------|------|--------|
| `PORT` | 容器内服务端口 | 否 | 3000 |
| `JWT_SECRET` | JWT 密钥（建议设置） | 否 | 自动生成 |
| `ADMIN_PASSWORD` | 管理员密码 | 否 | admin123 |
| `CORS_ORIGINS` | 允许的跨域来源（逗号分隔） | 否 | 允许所有 |
| `UPLOAD_DIR` | 上传文件目录 | 否 | /app/server/uploads |

---

## 📋 常用命令

### 服务管理

```bash
# 启动服务
docker start xcook

# 停止服务
docker stop xcook

# 重启服务
docker restart xcook

# 查看日志
docker logs -f xcook

# 删除容器
docker rm -f xcook
```

### 更新部署

```bash
# 停止并删除旧容器
docker stop xcook && docker rm xcook

# 拉取最新代码
git pull origin main

# 重新构建镜像
docker build -t xcook:latest .

# 启动新容器
docker run -d \
  --name xcook \
  -p 3000:3000 \
  -v xcook-data:/app/server/data \
  -v xcook-uploads:/app/server/uploads \
  -e JWT_SECRET=$(openssl rand -hex 64) \
  -e ADMIN_PASSWORD=admin123 \
  --restart unless-stopped \
  xcook:latest
```

### 进入容器

```bash
# 进入容器终端
docker exec -it xcook sh

# 查看数据库文件
docker exec -it xcook ls -la /app/server/data/

# 查看上传文件
docker exec -it xcook ls -la /app/server/uploads/
```

---

## 💾 数据备份与恢复

### 备份数据

```bash
# 创建备份目录
mkdir -p ~/backup

# 备份数据库
docker run --rm \
  -v xcook-data:/data \
  -v ~/backup:/backup \
  alpine tar czf /backup/xcook-data-$(date +%Y%m%d).tar.gz /data

# 备份上传文件
docker run --rm \
  -v xcook-uploads:/data \
  -v ~/backup:/backup \
  alpine tar czf /backup/xcook-uploads-$(date +%Y%m%d).tar.gz /data
```

### 恢复数据

```bash
# 恢复数据库
docker run --rm \
  -v xcook-data:/data \
  -v ~/backup:/backup \
  alpine sh -c "cd / && tar xzf /backup/xcook-data-backup.tar.gz"

# 恢复上传文件
docker run --rm \
  -v xcook-uploads:/data \
  -v ~/backup:/backup \
  alpine sh -c "cd / && tar xzf /backup/xcook-uploads-backup.tar.gz"

# 重启容器
docker restart xcook
```

---

## 🔧 高级配置

### 使用 Nginx 反向代理

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

## ❓ 常见问题

### 1. 端口被占用

```bash
# 查看端口占用
netstat -tlnp | grep 3000

# 使用其他端口
docker run -d --name xcook -p 3001:3000 ... xcook:latest
```

### 2. 容器无法启动

```bash
# 查看详细日志
docker logs xcook

# 重新构建
docker build --no-cache -t xcook:latest .
```

### 3. 登录注册报错 "is not valid JSON"

确保 API 路由正确，检查容器日志：

```bash
docker logs xcook
curl http://localhost:3000/health
curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"123456"}'
```

### 4. 局域网无法访问

确保容器绑定到 `0.0.0.0`，并检查防火墙：

```bash
# 检查容器端口绑定
docker port xcook

# 开放防火墙端口
sudo ufw allow 3000
```

### 5. 数据丢失

确保使用 Docker 数据卷持久化数据：

```bash
# 查看数据卷
docker volume ls | grep xcook

# 数据卷位置
docker volume inspect xcook-data
docker volume inspect xcook-uploads
```

### 6. 忘记管理员密码

重新启动容器时设置新密码：

```bash
docker rm -f xcook
docker run -d --name xcook ... -e ADMIN_PASSWORD=new-password ... xcook:latest
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

## 📝 更新日志

### v1.2.0
- 🐛 修复 Docker 部署 API 路由问题
- 🐛 修复局域网 HTTP 访问安全策略问题
- ✨ 支持自定义端口配置
- ✨ 优化 Docker 镜像构建

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

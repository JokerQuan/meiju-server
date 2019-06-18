## 美剧服务端项目
### 开发环境
Node.js v10.16.0

npm 6.9.0

### 开发环境运行

1. 安装 MongoDB、MongoDB Campass（可视化管理数据）

2. 安装并运行爬虫项目，获取数据到数据库

    [美剧爬虫项目](https://github.com/JokerQuan/meiju_spider)
    

3. 克隆到本地

    > git clone https://github.com/JokerQuan/meiju-server.git

4. 安装依赖

    > npm i

    *默认运行在5000端口，可在 /bin/www 中配置，与前端项目中得代理端口一致*

5. 运行
    > npm run dev

### 生产环境运行

1. 安装 MongoDB

    [MongoDB官网](https://www.mongodb.com/)

2. 克隆到本地或服务器，安装依赖（同开发环境）

3. 安装 pm2（方便管理 node 进程）

    > npm install -g pm2

4. 运行

    > npm run prd

    *package.json中已配置此运行方式为用 pm2 启动*

5. pm2 基本命令

    > pm2 list （查看 pm2 启动的进程列表）

    > pm2 logs （查看 pm2 启动的进程日志）

    > pm2 start|stop id|name （通过进程的 id 或 name 启动/停止进程）

### 开发计划

    *由前端项目驱动*
    [美剧前端项目](https://github.com/JokerQuan/meiju-client)
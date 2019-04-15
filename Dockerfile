# 基础镜像为node，版本为v9.2.0
FROM daocloud.io/library/node


# 创建容器内的项目存放目录
RUN mkdir -p /home/node-elm
WORKDIR /home/node-elm

#  将Dockerfile当前目录下所有文件拷贝至容器内项目目录并安装项目依赖
COPY . /home/Service
COPY package.json /home/Service
RUN npm install --registry=https://registry.npm.taobao.org

# 容器对外暴露的端口号，要和node项目配置的端口号一致
EXPOSE 8010

# 容器启动时执行的命令
CMD [ "npm", "run", "dev"]
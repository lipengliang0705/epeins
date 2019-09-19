# loginsight-ui 

## 项目结构

```
loginsight-ui/                       # 项目名 
├── bower_components/               # bower插件
├── docker/                         
├── docs/   
├── gulp/                           # gulp配置                          
├── node_modules/ 
├── release/                        # 打包目录
├── src/                            # 开发目录                   
│     ├── app/ 
│     │     ├── blocks/             # 配置文件，注入器，服务
│     │     ├── pages/              # 所有的页面folder
│     │     ├── theme/              # compontents,css,filters,services
│     │     └── app.js
│     ├── assets/  
│     ├── sass/   
│     ├── 404.html                  
│     ├── auth.html                 # 登录页面
│     ├── index.html                # 首页
│     └── reg.html
├── .gitignore
├── bower.json
├── gulp.config.js
├── gulpfile.js
├── package.json
└── README.md
```

## 搭建开发环境
**nodejs(推荐v8.15.0)**

下载地址：[https://nodejs.org/download/release/v8.15.0/]()


**IDE推荐**: [vscode](https://code.visualstudio.com/)，[webstorm](http://www.jetbrains.com/webstorm/)

## 项目开发准备
1.登录 gitlab，fork 项目到自己的仓库，项目地址：
```
https://git.dev.pi/hrcu/loginsight-ui
```

2.将自己仓库的项目克隆到本地(以zhangang为例)
```
git clone https://git.dev.pi/zhangang/loginsight-ui.git
```

3.新增上游分支
```
git remote add upstream  https://git.dev.pi/hrcu/loginsight-ui.git
```
## 项目运行
**第一次运行**
```
cd loginsight-ui 
npm install //或 yarn install,需要安装yarn
npm run serve
```

## 如何提交代码

1.本地代码开发完成，每次提交前，先合并上游仓库代码：
```
git pull upstream develop
```
2. 如果有冲突，请手动解决。
3. 提交代码到自己仓库。
```
git add . 
git commit -m '提交描述...'
git push origin develop
```
4. 进入 gitlab，点击头部左侧的 **+**，选择`New merge request`，提交合并请求到`develop`分支。

## 项目如何打包

```
npm run build
```
生成的`release`文件夹则为打包文件.


## 项目如何发布

1.进入jenkins页面, http://jenkins.dev.pi:8080/ 

2.进入ui目录，`Jenkins->hrcu->management->ui`

3.先停掉正在运行的`deploy` （页面左侧中间部分能找到，没有直接下一步）

4.依次点击`build`,完成后 ->点击`package`，完成后 -> 点击`deploy`，即可发布成功。

5.访问`http://10.128.2.166:3000/`,验证发布结果。

## 如何切换后台接口地址

打开`gulp`文件夹->`server.js`，修改`target`地址,重启本地服，即可

## 如何新建一个新页面

## 如何新增scss文件
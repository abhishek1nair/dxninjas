# Diagnostics Ninjas Hackathon Project

## Setting up Front End Environment (For Mac)

### Installing NVM

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
 ```

 ### Configure NVM
- Note: more info [NVM Installation](https://github.com/creationix/nvm/blob/master/README.markdown#installation)
```bash
source ~/.bash_profile
```

### Install npm (current LTS)
```bash
nvm install 8
```

### Clone Repo

```bash
git clone https://github.com/abhishek1nair/dxninjas.git
```


### Setting up NVM
Add the following line to .bash_profile

```bash
nvm use 8
```

### Move into the FE Folder
Add the following line to .bash_profile

```bash
 cd ./onetap
```

### Install Packages

```bash
npm install
```

### Install server (Prod server for dxninjas FE)
```bash
npm install -g serve
```


### Configure parameters (default)
```bash
cp ./src/constants/constants.js.sample ./src/constants/constants.js
```

### Starting Development Environment
- Starting dev server
  - Desktop Version
  ```bash
  npm start
  ```

### Starting production development build
- Build all files (For Desktop Version)
```bash
npm run build
```

- Run production server
```bash
serve -s build
```

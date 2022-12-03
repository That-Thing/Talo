
# Talo

<p align="center">
  <img src="https://files.catbox.moe/8i6rup.png"><br>
  The main dashboard and landing page for Interesting Project.
</p>

## Installation

#### Node JS
install JS from [Volta](https://volta.sh/) or something else  
`curl https://get.volta.sh | bash`

#### MySQL
```bash
sudo apt install mysql-server
sudo systemctl start mysql.service
```
Make sure to go through the process of setting up a MySQL user account and changing the password for maximum security. 
#### Clone repository

```bash
git clone git@github.com:That-Thing/talo.git
cd talo
```
#### Modify Config
```bash
nano config/config.json
```
#### Initialize SQL Database
Enter the MySQL console
```bash
mysql -u username -p
```
In the MySQL console, execute the database SQL file.
```bash
mysql> source /path/to/talo/database.sql
```

#### Nginx Reverse Proxy
Replace *8081* with the listen port for nginx  
Replace *your.domain* with your domain or server IP  
Replace *3000* in the proxy pass with the port you specified in the Talo config

```nginx
server {
    listen 8081;
    listen [::]:8081;
    server_name your.domain www.your.domain;

    location / {
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        include proxy_params;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

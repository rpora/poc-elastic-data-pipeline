client node elastic search disponible
import csv et xls via logstash ? 

comment intégrer les documents indexé via elastic avec la solution? 
    - dataset
    - securtié
    
Flow import > elastic > postgis > carto

Document indexing persistance quand docker => volumes etc

```bash

### Add an user document
POST {{ELASCTIC_HOST}}/app/users/4
Content-Type: application/json
{
  "id": 4,
  "username": "john",
  "last_login": "2018-01-25 12:34:56"
}
###


```

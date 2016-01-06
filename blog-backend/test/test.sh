curl  --data 'account=14331048&password=14331048&name=dylan' \
http://localhost:3000/api/register
echo '\n'
curl -c cookie14331048.file --data 'account=14331048&password=14331048' \
http://localhost:3000/api/login
echo '\n'
curl -b cookie14331048.file --data 'title=happy&content=I am the king' \
http://localhost:3000/api/post
echo '\n'

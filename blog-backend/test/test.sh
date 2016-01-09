curl  --data 'account=14331048&password=14331048&name=dylan' \
http://localhost:3000/Mapi/register
echo '\n'
curl -c cookie14331048.file --data 'account=14331048&password=14331048' \
http://localhost:3000/api/login
echo '\n'
curl -b cookie14331048.file  \
http://localhost:3000/api/posts
echo '\n'
# curl -b cookie14331048.file --data 'title=happy&content=I am the king' \
# http://localhost:3000/api/post
# echo '\n'
# curl -b cookie14331048.file -X PUT --data 'title=123&content=456' \
# http://localhost:3000/api/post/568df7d8713c548362ca0659
# echo '\n'
# curl -b cookie14331048.file -X DELETE \
# http://localhost:3000/api/post/568e08f6b5de454075f9b6a9
# echo '\n'
# curl -b cookie14331048.file --data 'content=cccccoooommmmeeeennnnttt' \
# http://localhost:3000/api/post/569088574e08d2441fb561b9/comment
# echo '\n'
# curl -b cookie14331048.file -X PUT --data 'content=modify' \
# http://localhost:3000/api/post/568e6a3df4d195564c8e326a/comment/568e6a58f4d195564c8e326b
# echo '\n'

# curl -b cookie14331048.file -X DELETE \
# http://localhost:3000/api/post/568e6deb0f62817351aa4da3/comment/568e6e040f62817351aa4da4
# echo '\n'

# curl -b cookie14331048.file -X PUT \
# http://localhost:3000/Mapi/post/569088574e08d2441fb561b9/comment/5690886b4e08d2441fb561ba
# echo '\n'
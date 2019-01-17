wrk.method = "POST"
wrk.body   = '{"query": "{ getAuth(id: 134595) { auths { itemname } user { fname lname ctag } } }"}'
wrk.headers["Content-Type"] = "application/json"
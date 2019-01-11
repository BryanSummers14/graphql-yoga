wrk.method = "POST"
wrk.body   = '{"query": "query { getBuzz { id } }"}'
wrk.headers["Content-Type"] = "application/json"
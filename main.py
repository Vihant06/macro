import http.client

conn = http.client.HTTPSConnection("oss.exercisedb.dev")

conn.request("GET", "/api/v1/muscles")

response = conn.getresponse()
print(response.read().decode())

conn.close()
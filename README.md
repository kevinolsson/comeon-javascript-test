![comeon-javascript-test-site](http://b5fa2dae67bf7ee0b0e5-e0d56d540e31d5f2f9430984d20d712d.r41.cf3.rackcdn.com/comeon-javascript-test_3.png)
# comeon-javascript-test

Work assignment for ComeOn!

### Setup mock api
```javascript
npm install -g json-server
```

```javascript
json-server --watch mock/mock-data.json --port 3001 --middlewares mock/mock-api.js
```

Then simply open the index.html
const express = require('express');
const port = 8000;
//app object
const app = express();
const axios = require('axios');
//f you are using Express 4.16+ 
app.use(express.json()); //Used to parse JSON bodies

app.get("/api/chat/statistics", (request, response) => {
    const {startDate,endDate}=request.query;
    console.log("dsfdfds", new Date(startDate).setHours(0,0,0,0),endDate)
    // api url
    const REQUEST_URL =
        "https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json";
    // Storing response
    axios.get(REQUEST_URL)
        .then(entity => {

            if (entity && entity.data.length > 0) {

                let result = entity.data
                    .map(item => item.websiteId)
                    .filter((item, index, self) => self.indexOf(item) === index)
                    .map(websiteId =>
                        entity.data
                            .filter(_item => _item.websiteId === websiteId)
                            .reduce(
                                (r, c) => {
                                    r.chats += c.chats;
                                    r.missedChats += c.missedChats;
                                    r.websiteId = c.websiteId;
                                    return r;
                                },
                                { chats: 0, missedChats: 0 },
                            ),
                    );

                return response.send({
                    "outputCode": 200,
                    "message": "success",
                    "outputData": result
                });
            }
            else {
                return response.send({
                    "outputCode": 404,
                    "message": "No records found"
                })
            }
        })
        .catch(error => {
            console.log(error);
            return response.send({
                "outputCode": 500,
                "message": error
            })
        });

})


app.listen(port, () => {
    console.log("server is running on port ", port);
})


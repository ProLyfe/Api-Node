const express = require('express');
const app = express();
const fs = require('fs');
const json = './api/data/manga.json';

app.get('/', (req, res) => {
    res.sendFile(json, {root: __dirname});
});

app.get('/manga', (req, res) => {
    //search by parameters  => /manga?id=2 or /manga?title=Naruto
    const reqId = req.query['id'];
    const reqTitle = req.query['title'];

    if (!reqId && !reqTitle) {
        res.send({
                     "Request Method": "GET",
                     "Status Code": "400",
                     "Message": "Query parameter should contain 'id' or 'title'",
                 });
    } else {
        //find by id
        if (reqId) {
            fs.readFile(json, (err, data) => {
                const singleData = JSON.parse(data)[reqId - 1];

                if (!singleData) {
                    //error400
                    res.send({
                                 "Request Method": "GET",
                                 "Status Code": "404",
                                 "Message": `Manga id = ${reqId} does not exist`,
                             });
                    res.send(singleData);
                }
            });
        }
        ;

        //find by title
        if (reqTitle) {
            fs.readFile(json, (err, data) => {
                const singleTitle = JSON.parse(data).find(manga => manga.title === reqTitle);
                if (!singleTitle) {
                    //error400
                    res.send({
                                 "Request Method": "GET",
                                 "Status Code": "404",
                                 "Message": `Manga title = ${reqTitle} does not exist`,
                             });
                    res.send(singleData);
                }
                res.send(singleTitle);
            });
        }
    }
});

app.post('/manga/new', (req, res) => {
    let newTitle = req.query['title'];
    let newAuthor = req.query['author'];
    let newDate = req.query['date'];

    if (!newTitle || !newAuthor || !newDate) {
        //error400
        res.send({
                     "Request Method": "POST",
                     "Status Code": "400",
                     "Message": "Missing query parameters should contain 'title' , 'author' and 'date'",
                 });

    } else {
        fs.readFile(json, 'utf-8', (err, data) => {
            let array = JSON.parse(data)
            let longueur = array.length;

            array.push({
                           id: longueur + 1,
                           title: newTitle,
                           author: newAuthor,
                           date: newDate
                       })

            fs.writeFile(json, JSON.stringify(array), (err) => {
                err ? console.log(err) : null;
            });
        })
    }
    res.send('new manga added : ' + {
        "title": newTitle,
        "author": newAuthor,
        "date": newDate
    });
});

app.put('/manga/edit', (req, res) => {
    const reqId = req.query['id'];
    if (!reqId) {
        res.send({
                     "Request Method": "PUT",
                     "Status Code": "400",
                     "Message": "Query parameter should contain 'id'",
                 });
    } else {
        fs.readFile(json, 'utf-8', (err, data) => {
            let array = JSON.parse(data)
            let newTitle = req.query['title'];
            let newAuthor = req.query['author'];
            let newDate = req.query['date'];

            const modif = {
                id: parseInt(req.query['id']),
                title: newTitle,
                author: newAuthor,
                date: newDate,
            };
            const newTab = array.filter(manga => manga.id !== modif.id)
            newTab.push(modif);

            fs.writeFile(json, JSON.stringify(newTab.sort((a, b) => a.id - b.id)), (err) => {
                err ? console.log(err) : null;
            });
        })
        res.send(`manga id = ${reqId} edited`);

    }

});

app.delete('/manga/delete', (req, res) => {
    const reqId = req.query['id'];
    if (reqId) {
        fs.readFile(json, (err, data) => {
            let array = JSON.parse(data);
            const singleData = array[reqId - 1];
            const filteredManga = array.filter(manga => manga.id !== singleData.id);

            fs.writeFile(json, JSON.stringify(filteredManga), (err) => {
                err ? console.log(err) : null;
            });
        });
        res.send(`manga id = ${reqId} deleted`);
    } else {
        res.send({
                     "Request Method": "DELETE",
                     "Status Code": "400",
                     "Message": "Query parameter should contain 'id'",
                 });
    }
});

app.listen(8989);
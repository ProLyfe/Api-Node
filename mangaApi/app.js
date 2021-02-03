const express = require('express');
const app = express();
const fs = require('fs'); 
const json = './api/data/manga.json';

app.get('/', (req, res) => {
  //get all entities
  res.sendFile(json, { root: __dirname });
});

app.get('/manga', (req, res) => {
  //search by parameters  => /manga?id=2 or /manga?title=Naruto 
  const reqId = req.query['id'];
  const reqTitle = req.query['title'];
  
  if(!reqId && !reqTitle) {
    //redirect to home if query null
    res.redirect('/');
  } else {
    //find by id
    if(reqId){
      fs.readFile(json, (err, data) => {
        const singleData = JSON.parse(data)[reqId -1];
        res.send(singleData);
      });
    };
    
    //find by title
    if(reqTitle){
    fs.readFile(json, (err, data) => {
      const singleTitle = JSON.parse(data).find(manga => manga.title === reqTitle);  
      res.send(singleTitle);   
      });         
    }
  };
});

app.post('/manga/new', (req, res) => {
  let newTitle = req.query['title'];
  let newAuthor = req.query['author'];
  let newDate = req.query['date'];

  fs.readFile(json, 'utf-8', (err, data) => {
    let array = JSON.parse(data)
    let longueur = array.length;

    array.push({
      id : longueur + 1,
      title: newTitle,
      author: newAuthor,
      date: newDate
    })

    fs.writeFile(json, JSON.stringify(array), (err) => {
        err ? console.log(err) : null;
    });
  })


  
  res.send('new manga added : '+ newTitle + ' ' + newAuthor + ' ' + newDate);

  //code erreur 422 si un parametre manque
});

app.put('/manga/edit', (req, res) => {

  const reqId = req.query['id'];

  fs.readFile(json, 'utf-8', (err, data) => {
    let array = JSON.parse(data)
    let longueur = array.length;

    let newTitle = req.query['title'];
    let newAuthor = req.query['author'];
    let newDate = req.query['date'];
    
    const modif = {
      id : parseInt(req.query['id']),
      title: newTitle,
      author: newAuthor,
      date: newDate,
    };

    const singleData = array[reqId -1];
    const newTab = array.filter(manga => manga.id !== modif.id)
    newTab.push(modif);
    
    fs.writeFile(json, JSON.stringify(newTab.sort((a, b) => a.id - b.id)), (err) => {
      err ? console.log(err) : null;
  });
  })
  
  //edit by id only
  res.send('manga edited :');

});

app.delete('/manga/delete', (req, res) => {
  //by id only
  const reqId = req.query['id'];
  if(reqId){
    fs.readFile(json, (err, data) => {
      let array = JSON.parse(data);
      const singleData = array[reqId - 1];
      const filteredManga = array.filter(manga => manga.id !== singleData.id);

      fs.writeFile(json, JSON.stringify(filteredManga), (err) => {
        err ? console.log(err) : null;
    });
    });
  }
  res.send('manga deleted :');
});

app.listen(8989);
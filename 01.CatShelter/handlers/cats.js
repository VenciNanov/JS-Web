const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds');
const cats = require('../data/cats');


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/addCat.html')
        );

        let stream = fs.createReadStream(filePath);

        stream.on('data', (data) => {
            res.write(readBreeds(data));
        });

        stream.on('end', () => {
            res.end();
        })

        stream.on('err', () => {
            console.log(err);
            res.writeHead(404, {
                'Content-Type': 'text:plain'
            });
            res.write('404 Not Fount!');
        })

    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            }

            console.log(files.upload.path);

            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.name));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    throw err;
                }
                console.log('File Uploaded!')
            })

            fs.readFile('../01.CatShelter/data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                let cats = JSON.parse(data);
                cats.push({ Id: cats.length + 1, ...fields, Image: files.upload.name });
                let json = JSON.stringify(cats);
                fs.writeFile('../01.CatShelter/data/cats.json', json, () => {
                    res.writeHead(302, { Location: '/' });
                    res.end();
                })
            })
        })

    } else if (pathname === '/cats/add-breed' && req.method == 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/addBreed.html')
        );

        let stream = fs.createReadStream(filePath);

        stream.on('data', (data) => {
            res.write(data);
        });

        stream.on('end', () => {
            res.end();
        })

        stream.on('err', () => {
            console.log(err);
            res.writeHead(404, {
                'Content-Type': 'text:plain'
            });
            res.write('404 Not Fount!');
        })
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';

        req.on('data', (data) => {
            formData += data;
        });

        req.on('end', () => {

            let body = qs.parse(formData);

            fs.readFile('../01.CatShelter/data/breeds.json', (err, data) => {
                if (err) {
                    throw err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('../01.CatShelter/data/breeds.json', json, 'utf-8', () => console.log('The breed was updated successfully'));
            });

            res.writeHead(302, { Location: '/' });
            res.end();
        })


    } else if (pathname.includes('/cats/edit-cat') && req.method === 'GET') {

        let filePath = path.normalize(
            path.join(__dirname, '../views/editCat.html')
        );

        let stream = fs.createReadStream(filePath);

        stream.on('data', (data) => {
            res.write(fillEditTemplate(data, pathname));
        });

        stream.on('end', () => {
            res.end();
        })

        stream.on('err', () => {
            console.log(err);
            res.writeHead(404, {
                'Content-Type': 'text:plain'
            });
            res.write('404 Not Found!');
        })
    } else if (pathname.includes('/cats/edit-cat') && req.method === 'POST') {

    } else if (pathname.includes('/cats/find-new-home') && req.method === 'GET') {

    } else if (pathname.includes('/cats/find-new-home') && req.method === 'GET') {

    } else {
        return true;
    }
}

function readBreeds(data) {
    let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
    let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);

    return modifiedData;
}

function getIdFromUrl(url) {
    let split = url.split('/');

    return split[3];

}

function getCatById(id) {

    let cat = cats.filter((cat) =>  cat.Id === +id);

    return cat;
}

function fillEditTemplate(data, pathname) {
    let catId = getIdFromUrl(pathname);

    let cat = getCatById(catId)[0];
  

    let modifiedData = data.toString().replace('{{id}}', catId);
    modifiedData = modifiedData.replace('{{name}}', cat.name);
    modifiedData = modifiedData.replace('{{description}}', cat.description);

    const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
    modifiedData = modifiedData.replace('breeds', breedsAsOptions.join('/'));
    modifiedData = modifiedData.replace('{{breed}}', cat.breed);

    return modifiedData;
}
const url = require('url');
const fs = require('fs');
const path = require('path');
const cats = require('../data/cats');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/' && req.method === 'GET') {

        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                res.write('Page not found');
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            let modifiedCats = cats.map((cat) => ` <li>
            <img src="${path.join('./content/images/' + cat.Image)}" alt="${cat.name}">
            <h3>${cat.name}</h3>
            <p><span>Breed: </span>${cat.breed}</p>
            <p><span>Description: </span>${cat.description}</p>
            <ul class="buttons">
                <li class="btn edit"><a href="/cats/edit-cat/${cat.Id}">Change Info</a></li>
                <li class="btn delete"><a href="/cats/find-new-home/${cat.Id}">New Home</a></li>
            </ul>
        </li>`);

            let modifiedData = data.toString().replace('{{cats}}', modifiedCats);
          
            res.write(modifiedData);
            res.end();
        })

    } else {
        return true;
    }
}


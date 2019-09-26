const url = require('url');
const fs = require('fs');
const path = require('path');


function getContentType(url) {
    if (url.endsWith('.css')) {
        return 'text/css';
    } else if (url.endsWith('.jpeg')) {
        return 'image/jpeg';
    }
    else if (url.endsWith('.png')) {
        return 'image/png';
    }
    else if (url.endsWith('.svg')) {
        return 'image/svg';
    } else if (url.endsWith('.js')) {
        return 'text/javascript';
    }
    else if (path.extname(url) === '.ico') {
        return 'image/x-icon'
    } else {
        return true;
    }
}
module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content/') && req.method === "GET") {

        if ((pathname.endsWith('png') || pathname.endsWith('jpg') || pathname.endsWith('jpeg') || pathname.endsWith('ico') )&& req.method === 'GET') {
       
            fs.readFile(`./${pathname}`, (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    res.writeHead('Resource not found!')
                    res.end();
                    return;
                }
                res.writeHead(200,{
                    'Content-type':getContentType(pathname)
                })

                res.write(data);
                res.end();
            })
        } else {

            fs.readFile(`./${pathname}`, 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });

                    res.write('Resource not found!');
                    res.end();
                    return;
                }

                res.writeHead(200, {
                    'Content-Type': getContentType(pathname)
                });

                res.write(data);
                res.end();
            })
        }
    } else {
        return true;
    }

}


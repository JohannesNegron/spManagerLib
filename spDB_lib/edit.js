auth(database)
{
    let self = this;
    return new Promise((resolve,reject)=>
    {
        console.log(' * STEP 1/2: Auth into login.microsoftonline.com ...');
        return new Promise((resolve, reject)=>
        {
            var request = https.request(self.requestOptions, (res) => 
            {
                let rawData = '';
                res.setEncoding('utf8');
                res.on('data', (chunk) => rawData += chunk);
                res.on('end', () => {
                    var DOMParser = require('xmldom').DOMParser;
                    var doc = new DOMParser().parseFromString(rawData, "text/xml");
                    // KEY 1: Get SecurityToken
                    if ( doc.documentElement.getElementsByTagName('wsse:BinarySecurityToken').item(0) ) 
                    {
                        self.gBinarySecurityToken = doc.documentElement.getElementsByTagName('wsse:BinarySecurityToken').item(0).firstChild.nodeValue;
                        resolve();
                    }
                    else 
                    {
                        reject('Invalid Username/Password');
                    }
                });
            });

            request.on('error', (err) =>
            {
                console.log(`problem with request: ${err.message}`);
                reject();
            });
            request.write(self.xmlRequest);
            request.end();
        })
        .then(()=>
        {
            console.log(' * STEP 2/2: Auth into SharePoint ...');
            return new Promise((resolve, reject)=>
            {
                var options = CONTS.optionsAuthRequest(self.SP_HOST, self.gBinarySecurityToken)
                //console.log(options)
                // IMPORTANT: SharePoint online will only return the 2 auth cookies with https queries (it will respond to http, but not include cookies!)
                var request = https.request(options, (response) => 
                {
                    // KEY 2: Get 2 auth cookie values
                    self.gAuthCookie1 = response.headers['set-cookie'][0].substring(0,response.headers['set-cookie'][0].indexOf(';'));
                    self.gAuthCookie2 = response.headers['set-cookie'][1].substring(0,response.headers['set-cookie'][1].indexOf(';'));
                    resolve();
                });
                
                request.on('error', (e) => 
                {
                    console.log(`problem with request: ${e.message}`);
                    reject(e);
                });
                request.write(self.gBinarySecurityToken);
                request.end();
            });
        })
        .then(()=>
        {
            console.log(' * SUCCESS!! Authenticated into "'+ self.SP_HOST +'"');
            self.sprLib.nodeConfig({ cookie:self.gAuthCookie1+' ;'+ self.gAuthCookie2, server:self.SP_HOST });
            self.sprLib.baseUrl(database);
            resolve(self.sprLib)
        })
    })
    
    .catch((strErr)=>
    {
        console.error('E R R O R');
        console.error(strErr)
        return;
    })
}   
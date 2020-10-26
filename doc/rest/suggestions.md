# Suggestions: The making of a REST API

This suggested REST API is expressive enough to perform the operations described in the [suggested Web UI](../webui/suggestions.md).

I found some great advice here:

* https://restfulapi.net/
* https://restfulapi.net/http-status-codes/

## Resource: Player

### `/dj/player` (**PUT**)

Used to (re)create a player.

**NOTE**: Must be called prior to any other resource method calls. The player's keys will be recreated!!

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">{
  "nym": "&lt;string (<32 characters)&gt;"
}</pre></td>
    <td valign="top">Status Code: 204</td>
  </tr>
</table>

After box initialization the player is disabled and its default nym is set to "admin". Do the following to enable the player and to rename it to "alice":

`$ curl --user admin:hello --digest -v -X PUT -H "Content-Type: application/json" -d '{"nym": "alice"}' http://127.0.0.1:8444/dj/player`

### `/dj/player` (**GET**)

Used to show all available information about the player.

**NOTE**: The "secret-key" is only available for one hour after box initialization.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
    <th align="left">Failure Response</th>
  </tr>
  <tr>
    <td valign="top">-</td>
    <td valign="top">Status Code: 200<pre lang="json">{
  "nym": "&lt;string (<32 characters)&gt;",
  "keys": {
    "public-key": "&lt;BASE64 binary&gt;",
    "secret-key": "&lt;BASE64 binary&gt;"
  }
}</pre></td>
    <td valign="top">Status Code: 404</td>
  </tr>
</table>

Typical usage:

`$ curl --user admin:hello --digest -v http://127.0.0.1:8444/dj/player`

### `/dj/player/filter` (**POST**)

Used to show a filtered set of information about the player.

**NOTE**: The "secret-key" is only available for one hour after box initialization.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
    <th align="left">Failure Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">{
  "nym": "&lt;boolean&gt;",
  "keys": {
    "public-key": "&lt;boolean&gt;",
    "secret-key": "&lt;boolean&gt;"
  }
}</pre></td>
    <td valign="top">Status Code: 200<pre lang="json">{
  "nym": "&lt;string (<32 characters)&gt;",
  "keys": {
    "public-key": "&lt;BASE64 binary&gt;",
    "secret-key": "&lt;BASE64 binary&gt;"
  }
}</pre></td>
    <td valign="top">Status Code: 404</td>
  </tr>
</table>

Omitted filter request fields are excluded from response.

Typical usage:

`$ curl --user alice:hello --digest -v -X POST -H "Content-Type: application/json" -d '{"keys": {"public-key": true}}' http://127.0.0.1:8444/dj/player/filter`

### `/dj/player` (**PATCH**)

Used to patch the player. One or several of the fields in the Request can be given.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
    <th align="left">Failure Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">{
  "smtp-server": {
    "password": "&lt;string&gt;"
  },
  "pop3-server": {
    "password": "&lt;string&gt;"
  }
}</pre></td>
    <td valign="top">Status Code: 204</td>
    <td valign="top">Status Code: 404</td>
  </tr>
</table>

Typical usage:

`$ curl --user alice:hello --digest -v -X PATCH -H "Content-Type: application/json" -d '{"smtp-server:": {"password": "foobar"}}' http://127.0.0.1:8444/dj/player`

## Resource: Key

### `/dj/key` (**GET**)

Used to show all available keys. At most 100 keys will be returned.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
  </tr>
  <tr>
    <td valign="top">-</td>
    <td valign="top">Status Code: 200<pre lang="json">[{
  "nym": "&lt;string (<32 characters)&gt;",
  "public-key": "&lt;BASE64 binary&gt;"
 }]</pre></td>
  </tr>
</table>

Typical usage:

```
$ curl --user alice:hello --digest http://127.0.0.1:8444/dj/key
[
  {
    "nym": "alice",
    "public-key": "BWFsaWNlxgDD8BleR0lZOyTVMuguqs9IE1E7SuWgsyyNNNp4vrrQZbpF8PSiEhju2dL3cMnc5ZFAoe41NQ4+C45r+Xwk9dpo3sn5Uwj+ETZw5nC\/StW+YeAlApeCZVL126AcOhQPtgRNyajc84Qg0dM7K5UDic\/81kb0EqkaZ1awtwUrmPs="
  },
  {
    "nym": "bob",
    "public-key": "AnAxBNN4r35tVwRRktbu2N83GmvDvTBdmTNeMLP+u6lPSfM4\/Oby3tGF07qbtQdaZgteOAXj3pB7xNhJbARmril0avcbbXs\/HlfJlidui7JZM0T7Uu+qWmq7X3qAUnYA42rM6lEI7pnfuKn+X4SW\/HTbaW4kBBjq3f\/ERruD2W5c9KoI"
  }
]
```

### `/dj/key/<nym>` (**GET**)

Used to show a key for a specific nym.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
    <th align="left">Failure Response</th>
  </tr>
  <tr>
    <td valign="top">-</td>
    <td valign="top">Status Code: 200<br>&lt;BASE64 binary&gt;</td>
    <td valign="top">Status Codes: 404</td>
</tr>
</table>

Typical usage:

```
$ curl --user alice:hello --digest http://127.0.0.1:8444/dj/key/alice
"BWFsaWNlxgDD8BleR0lZOyTVMuguqs9IE1E7SuWgsyyNNNp4vrrQZbpF8PSiEhju2dL3cMnc5ZFAoe41NQ4+C45r+Xwk9dpo3sn5Uwj+ETZw5nC\/StW+YeAlApeCZVL126AcOhQPtgRNyajc84Qg0dM7K5UDic\/81kb0EqkaZ1awtwUrmPs="
```

### `/dj/key/filter` (**POST**)

Used to show a filtered set of keys. At most 100 keys will be returned.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">["&lt;sub-string nym (<32 characters)&gt;"]</pre></td>
    <td valign="top">Status Code: 200<pre lang="json">[{
  "nym": "&lt;string (<32 characters)&gt;",
  "public-key": "&lt;BASE64 binary&gt;"
}]</pre></td>
  </tr>
</table>

Typical usage:

```
$ curl --user alice:hello --digest -X POST -H "Content-Type: application/json" -d '["p1"]' http://127.0.0.1:8444/dj/key/filter
[
  {
    "nym": "p1",
    "public-key": "AnAxBNN4r35tVwRRktbu2N83GmvDvTBdmTNeMLP+u6lPSfM4\/Oby3tGF07qbtQdaZgteOAXj3pB7xNhJbARmril0avcbbXs\/HlfJlidui7JZM0T7Uu+qWmq7X3qAUnYA42rM6lEI7pnfuKn+X4SW\/HTbaW4kBBjq3f\/ERruD2W5c9KoI"
  },
  {
    "nym": "p10",
    "public-key": "A3AxMLDb4hxZt3mSZ8Qa+kSfa2K4R\/ayLKhQX+RMNFn7NlS9cxG\/QXdtJy1S28abJ5HTKw+9S8pHw3caXjGCWWS8BfD77yhzbMQgA3Y9c\/\/gaL+nGPRO+4PmgpTykotSVe1VUPWUJO5fQ+oVFROGBjQDnZjLO0S7XI0Ekd37hCGTyS6d"
  },
  {
    "nym": "p100",
    "public-key": "BHAxMDABiS61z1AxsC2Kbx3GBrfb5pftV1\/piyCKOt\/\/DThArLGrxnnLTwz0flD8An33aoZmsAYBbJNE7k4HhL1F+cLvqZD\/d2oz2r0Lt4aBWCz2pDMas\/MIivQnbSJZWTse\/PxSuk95L0CfeKGgR61s5DAls652Rqsw4xsoIfibYJu26Pc="
  }
]
```

### `/dj/key` (**PUT**)

Used to import a new key.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
    <th align="left">Failure Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">{
  "nym": "&lt;string (<32 characters)&gt;",
  "public-key": "&lt;BASE64 binary&gt;"
}</pre></td>
    <td valign="top">Status Code: 204</td>
    <td valign="top">Status Code: 403</td>
  </tr>
</table>

Typical usage:

`$ curl --user alice:hello --digest -v -X PUT -H "Content-Type: application/json" -d '{"nym": "bob", "public-key": "=GST61#8=="}' http://127.0.0.1:8444/dj/key`

### `/dj/key/<nym>` (**DELETE**)

Used to delete a key for a specific nym.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Success Response</th>
    <th align="left">Failure Response</th>
  </tr>
  <tr>
    <td valign="top">-</td>
    <td valign="top">Status Code: 204</td>
    <td valign="top">Status Codes: 404, 403</td>
  </tr>
</table>

Typical usage:

`$ curl --user alice:hello --digest -v -X DELETE http://127.0.0.1:8444/dj/key/bob`

### `/dj/key/filter` (**DELETE**)

Used to delete a filtered set of keys.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">["&lt;nym (<32 characters)&gt;"]</pre></td>
    <td valign="top">Status Code: 200<pre lang="json">{
  "failed": [{"nym": "&lt;string (<32 characters)&gt;",
              "reason": "&lt;string&gt;"}]
}</pre></td>
  </tr>
</table>

Typical usage:

`$ curl --user alice:hello --digest -v -X DELETE -H "Content-Type: application/json" -d '["bob"]' http://127.0.0.1:8444/dj/key/filter`

### `/dj/key/export` (**POST**)

Used to export a key bundle.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Response</th>
  </tr>
  <tr>
    <td valign="top"><pre lang="json">["&lt;nym (<32 characters)&gt;"]</pre></td>
    <td valign="top">Status Code: 200<br>&lt;BASE64 encoded key bundle&gt;</td>
  </tr>
</table>

Typical usage:

`$ curl --user alice:hello --digest -v -X DELETE -H "Content-Type: application/json" -d '["alice, "bob"]' http://127.0.0.1:8444/dj/key/export`

### `/dj/key/import` (**POST**)

Used to import a key bundle.

<table>
  <tr>
    <th align="left">Request</th>
    <th align="left">Response</th>
  </tr>
  <tr>
    <td valign="top">&lt;BASE64 encoded key bundle&gt;</td>
    <td valign="top">Status Code: 204</td>
  </tr>
</table>

Typical usage:

`$ curl --user alice:hello --digest -v -X POST -H "Content-Type: text/plain" -d '=GA61Ga=="' http://127.0.0.1:8444/dj/key/import`
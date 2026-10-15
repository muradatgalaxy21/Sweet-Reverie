import csv,json,re,sys,os,mimetypes,requests
S,LIMIT=sys.argv[1],int(sys.argv[2])
env={k.strip():v.strip() for k,v in (l.split('=',1) for l in open('.env') if '=' in l)}
shop=env['NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN']
tok=requests.post(f'https://{shop}/admin/oauth/access_token',data={'grant_type':'client_credentials','client_id':env['SHOPIFY_CLIENT_ID'],'client_secret':env['SHOPIFY_CLIENT_SECRET']}).json()
H={'X-Shopify-Access-Token':tok['access_token'],'Content-Type':'application/json'}
print('scopes:',tok.get('scope'))
def gql(q,v=None):
    r=requests.post(f'https://{shop}/admin/api/2026-01/graphql.json',headers=H,json={'query':q,'variables':v or {}}).json()
    if r.get('errors'): raise SystemExit(json.dumps(r['errors']))
    return r['data']
d=gql('{ locations(first:5){nodes{id name}} publications(first:20){nodes{id name}} }')
loc=d['locations']['nodes'][0]['id']; pubs=[p['id'] for p in d['publications']['nodes'] if p['name']!='Point of Sale']
print('location',d['locations']['nodes'][0]['name'],'publications',[p['name'] for p in d['publications']['nodes']])
def handle(t): return re.sub(r'-+','-',re.sub(r'[^a-z0-9]+','-',t.lower().replace('&','and'))).strip('-')
def grams(t,w):
    m=re.findall(r'([\d.]+)\s*(kg|g|gm|ml)\b',(w+' '+t).lower())
    if not m: return None
    v,u=m[-1]; return float(v)*(1000 if u=='kg' else 1)
def stage(path):
    name=os.path.basename(path); mime=mimetypes.guess_type(name)[0] or 'image/jpeg'
    t=gql('mutation($i:[StagedUploadInput!]!){stagedUploadsCreate(input:$i){stagedTargets{url resourceUrl parameters{name value}} userErrors{message}}}',
        {'i':[{'resource':'IMAGE','filename':name,'mimeType':mime,'httpMethod':'POST','fileSize':str(os.path.getsize(path))}]})['stagedUploadsCreate']['stagedTargets'][0]
    r=requests.post(t['url'],data={p['name']:p['value'] for p in t['parameters']},files={'file':(name,open(path,'rb'),mime)})
    r.raise_for_status(); return t['resourceUrl']
SET='''mutation($id:ProductSetIdentifiers,$p:ProductSetInput!){productSet(identifier:$id,input:$p,synchronous:true){product{id handle} userErrors{field message}}}'''
PUB='mutation($id:ID!,$in:[PublicationInput!]!){publishablePublish(id:$id,input:$in){userErrors{message}}}'
log=open(S+'/upload-log.txt','a')
rows=list(csv.DictReader(open('shopify-import/products-batch-1.csv',encoding='utf-8')))[:LIMIT]
for i,r in enumerate(rows,1):
    h=handle(r['title']); g=grams(r['title'],r['weight'])
    inv={'tracked':True}
    if g: inv['measurement']={'weight':{'value':g,'unit':'GRAMS'}}
    p={'title':r['title'],'handle':h,'status':'ACTIVE','tags':[r['category']],
       'productOptions':[{'name':'Title','values':[{'name':'Default Title'}]}],
       'files':[{'originalSource':stage('assets/My-Products-Images/'+r['file']),'contentType':'IMAGE','alt':r['title']}],
       'variants':[{'optionValues':[{'optionName':'Title','name':'Default Title'}],'price':r['price'],'inventoryPolicy':'DENY',
                    'inventoryItem':inv,'inventoryQuantities':[{'locationId':loc,'name':'available','quantity':100}]}]}
    res=gql(SET,{'id':{'handle':h},'p':p})['productSet']
    if res['userErrors'] or not res['product']:
        print(i,'FAIL',h,res['userErrors']); log.write(f'FAIL {h} {res["userErrors"]}\n'); continue
    e=gql(PUB,{'id':res['product']['id'],'in':[{'publicationId':x} for x in pubs]})['publishablePublish']['userErrors']
    print(i,'ok',h,e or ''); log.write(f'ok {h} {res["product"]["id"]} {e}\n'); log.flush()

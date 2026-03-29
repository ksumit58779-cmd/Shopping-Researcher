import requests

def ip_lookup(ip=""):
    url = f"https://ipinfo.io/{ip}/json" if ip else "https://ipinfo.io/json"
    
    data = requests.get(url).json()
    
    if "bogon" in data:
        print("This is a private/local IP — not traceable!")
        return
    
    print(f"IP Address  : {data.get('ip', '—')}")
    print(f"Country     : {data.get('country', '—')}")
    print(f"Region      : {data.get('region', '—')}")
    print(f"City        : {data.get('city', '—')}")
    print(f"Timezone    : {data.get('timezone', '—')}")
    print(f"ISP / Org   : {data.get('org', '—')}")
    print(f"Coordinates : {data.get('loc', '—')}")
    print(f"Postal      : {data.get('postal', '—')}")

ip_lookup("2402:3a80:300:f45b:5187:3e63:c647:9e90")
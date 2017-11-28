# NowPlay

## Instalacja
```
git clone https://github.com/dajogzum/NowPlay
```

## Aktualizacja
```
cd ../modules/NowPlay
git pull
```
### Aktualizacja jeśli były zmieniane pliki lokalnie<br>
```
cd ../modules/NowPlay
git reset --hard
git clean -df
git pull
```
## Config
```
{
  module: "NowPlay",
  position: "bottom_left",
  config:{
    ipyamaha: "DEVICE_IP"
  }
},
```

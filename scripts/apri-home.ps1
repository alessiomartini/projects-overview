# Apre home.html in una finestra "app" dedicata di Chrome (profilo separato); se e' gia' aperta non fa nulla.
$prof = "$env:LOCALAPPDATA\home-app-profile"
if (Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -like "*home-app-profile*" }) { exit }
Start-Process "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=`"$prof`"","--app=file:///E:/Alessio/Projects_Git/home.html"

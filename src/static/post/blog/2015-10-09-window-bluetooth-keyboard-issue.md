윈오두 10으로 업데이트 한 후 발생했던 단 한가지 문제가 바로 블루투스 키보드 사용이었습니다. 윈도우 8.1에서도 잘 사용하던 블루투스 키보드였는데, 윈도우 10으로 업데이트를 한 뒤부터 인식은 되어 페어링 중이라고 떴지만 키보드가 먹통이었습니다. 

![window-bluetooth-keyboard-issue-01](https://user-images.githubusercontent.com/18159012/49141602-51278f80-f33a-11e8-89fe-356c9220e766.png)

<center>페어링만 되고 입력은 먹지 않는 상태</center>

 위와같이 인식은 되었지만 키보드 사용이 불가한 이유는 블루투스로 기기는 인식을 하였지만 인식한 기기가 입력 기기인지 컴퓨터가 인식을 제대로 못하는 것에서 발생한 것 같습니다.

 때문에 연결된 블루투스 키보드의 속성을 입력장치라고 직접 설정해주면 됩니다.

**해결방법**

1. 윈도우 설정에서 "장치" 항목을 클릭한 후 "프린터 및 스캐너" 항목에서 "장치 및 프린터" 버튼을 누릅니다.

![window-bluetooth-keyboard-issue-02](https://user-images.githubusercontent.com/18159012/49141650-6a304080-f33a-11e8-8b46-7e1314394734.png)

2. 페어링 된 블루투스 키보드 아이콘을 더블클릭하거나, 오른쪽 클릭 후 "속성" 버튼을 눌러 속성 창을 띄어줍니다.

![window-bluetooth-keyboard-issue-03](https://user-images.githubusercontent.com/18159012/49141669-787e5c80-f33a-11e8-876e-99806747d63f.png)

3. '서비스" 탭에서 "키보그, 마우스, 기타 HID 장치용 드라이버" 항목에 체크합니다.

![window-bluetooth-keyboard-issue-04](https://user-images.githubusercontent.com/18159012/49141679-7f0cd400-f33a-11e8-9a0c-85cc31990b59.png)

4. 다시 "설정-장치-Bluetooth" 항목으로 가보면 블루투스 키보드가 제대로 연결된 것을 볼 수 있습니다.

![window-bluetooth-keyboard-issue-05](https://user-images.githubusercontent.com/18159012/49141691-846a1e80-f33a-11e8-8f5e-fcd72b993de1.png)




  
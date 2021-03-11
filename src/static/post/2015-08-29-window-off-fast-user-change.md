빠른 사용자 전환이란 같은 컴퓨터를 여러명이서 사용할 때 각 사용자에 대해 빠르게 윈도우 계정을 전환하기 위해 사용하는 기능입니다. 만약 컴퓨터를 혼자서 사용하신다면 이 옵션을 끄는 것으로 약간의 성능 향상 효과를 얻을 수 있습니다.




1. "윈도우키+R" 버튼으로 실행창을 띄어주신 후, "gpedit.msc"를 입력한 뒤 확인을 눌러줍니다.

![window-off-fast-user-change-01](https://user-images.githubusercontent.com/18159012/49195282-c68e7100-f3c9-11e8-9664-24c6d094a1b5.png)


2. "로컬 컴퓨터 정책\컴퓨터 구성\관리 템플릿\시스템\로그온" 항목 중 

​     "빠른 사용자 전환의 진입점 숨기기"를 선택해 더블 클릭해줍니다.

![window-off-fast-user-change-02](https://user-images.githubusercontent.com/18159012/49195291-cc845200-f3c9-11e8-9d3c-6e54ab029e6e.png)


3. 진입점 숨기기 옵션 중 "사용"에 체크해 주시고 확인을 눌러줍니다.

![window-off-fast-user-change-03](https://user-images.githubusercontent.com/18159012/49195293-d27a3300-f3c9-11e8-8b6f-3662bfb6d896.png)


4. 다시 "윈도우키+R"버튼을 눌러 실행창을 띄어주신 후 "gpudate /force"를 입력한 후 확인을 눌러줍니다.

![window-off-fast-user-change-04](https://user-images.githubusercontent.com/18159012/49195334-ffc6e100-f3c9-11e8-9028-b9f34bea4d37.png)


5. 정책을 업데이트한 후 빠른 사용자 전환을 끄게 됩니다.

![window-off-fast-user-change-05](https://user-images.githubusercontent.com/18159012/49195272-bc6c7280-f3c9-11e8-9173-e43da0dad4fd.png)
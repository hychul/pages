리액트로 블로그를 만들던 중 윈도우 리사이징을 처리하던 중 parent 컴포넌트가 child 컴포넌트 되는 상황이 발생했다.

child 컴포넌트의 코드 블록 또는 이미지의 폭이 parent 컴포넌트의 폭보다 큰 경우, %로 child의 width 값을 지정하는 경우 parent의 폭의 100%로 맞춰지는 것이 아니라 parent의 폭이 child의 코드 블록 혹은 이미지 사이즈보다 작아지지않고 윈도우 사이즈만 작아져 전체 웹뷰에 스크롤이 생기고 말았다.

내가 원하는 동작은 child의 폭이 parent의 폭이 맞춰서 작아지고 코드블록과 이미지에 스크롤이 생기는 것이었는데 원하는 데로 되지 않아 당황스러웠다. ~~거지같은 CSS...~~

[예시 화면]

한참을 헤메다가 **음수 마진<sup>Negative Margins</sup>** 이라는 것을 알게되었다.

# 음수 마진<sup>Negative Margins</sup>과 vw / vh

해결하는 방법은 아주 간단했는데 바로 width를 100%로 지정하고 음수 마진과 vw를 사용하는 것이다.

음수 마진을 사용하면 컴포넌트 안쪽으로 마진이 생길 것 같지만 음수 마진과 vw를 함께 사용하면 음수 값 만큼 밀어내려고 하지만 width 가 100%로 지정되어 parent의 width 만큼 컨텐츠가 늘어나게 된다.
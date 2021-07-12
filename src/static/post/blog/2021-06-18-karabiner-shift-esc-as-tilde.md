현재 미니 키보드를 사용중인데, QMK 같은 키 맵핑을 지원하는 PCB와 달리 기본적으로 Shift + ESC 조합으로 ~ 을 사용할 수 없어, Fn + Shift + ESC 키의 조합으로 ~ 을 사용하고 있다.

이를 간단한 카라비너 설정을 통해서 Fn 키 없이 사용할 수 있도록 수정할 수 있다.

# 카라비너에서 키조합 설정하기
카라비너에 키 조합에 대한 설정을 추가하려면 '~/.config/karabiner/assets/complex_modifications/' 디렉토리 안에 json 형식의 파일을 추가해줘야한다.

```terminal
$ vi ~/.config/karabiner/assets/complex_modifications/tilde.json
```

```json
{
    "title": "tilde",
    "rules": [
        {
            "description": "right shift + escape = tilde",
            "manipulators": [
                {
                    "type": "basic",
                    "from": {
                        "key_code": "escape",
                        "modifiers": {
                            "mandatory": [
                                "right_shift"
                            ]
                        }
                    },
                    "to": [
                        {
                            "key_code": "grave_accent_and_tilde",
                            "modifiers": ["right_shift"]
                        }
                    ]
                }
            ]
        }
    ]
}
```

위와같이 json 파일을 추가하고 나면, Karabiner-Elements에서 'Complex modifications' / 'Add rule' 에서 추가한 json 파일의 이름을 확인할 수 있다. 해당 rule을 적용하면 설정한 키조합이 동작하게 된다.

> 그냥 shift가 아닌 right_shift를 키코드로 사용한 이유는 shift + esc의 조합을 갖는 단축키도 존재할 수 있기 때문에, 일반적인 타이핑 방식의 양손으로 shift와 esc를 입력하는 경우엔 물결로, 왼손만을 사용한 입력에선 단축키가 동작하도록 하기 위해서 이다.

<img width="1004" alt="2021-06-18-karabiner-shift-esc-as-tilde-1" src="https://user-images.githubusercontent.com/18159012/122512929-93259780-d044-11eb-9e1e-8f0adfa5db12.png">
<img width="1003" alt="2021-06-18-karabiner-shift-esc-as-tilde-2" src="https://user-images.githubusercontent.com/18159012/122512968-a6386780-d044-11eb-96b2-76da380d585a.png">


해당 룰을 적용하더라도 동작하지 않는다면 Karabiner-Elements의 Devices 탭의 사용하는 키보드에서 설정이 동작하도록 체크가 되어있는지 확인하고 적용하면 된다.

<img width="1003" alt="2021-06-18-karabiner-shift-esc-as-tilde-3" src="https://user-images.githubusercontent.com/18159012/122512996-b2bcc000-d044-11eb-8b18-abd21e0bcb2f.png">

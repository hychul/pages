<a name="top"></a>
# Header
| Markdown | Result      |
| -        | -           |
| # h1     | <h1>h1</h1> |
| # h2     | <h2>h2</h2> |
| # h3     | <h3>h3</h3> |
| # h4     | <h4>h4</h4> |
| # h5     | <h5>h5</h5> |

# Heading Id
```markdown
### Heading {#custom-id}
```
output:
### Heading {#custom-id}

# Table 
```markdown
| Syntax    |  Description |
| -         | -            |
| Header    | Title        |
| Paragraph | Text         |
```
output:
| Syntax    |  Description |
| -         | -            |
| Header    | Title        |
| Paragraph | Text         |

## Alignment
```markdown
| Syntax    |  Description | More Text |
| :-        | :-:          | -:        |
| Header    | Title        | null      |
| Paragraph | Text         | test      |
```
output:
| Syntax    |  Description | More Text |
| :-        | :-:          | -:        |
| Header    | Title        | null      |
| Paragraph | Text         | test      |


# Code Block
`~~~` 혹은 ` ``` `를 코드블록 위아래에 삽입
~~~markdown
```c
void foo() {
    printf(%s, "Hello Markdown");
}
```
~~~
output:
```c
void foo() {
    printf(%s, "Hello Markdown");
}
```

# Emphasis
| Markdown   | Result   |
| -          | -        |
| Text       | *text*   |
| Text       | _text_   |
| Text       | **text** |
| Text       | __text__ |
| Text       | ~~text~~ |


# Inline Code Block
`` `(Back quote)``를 텍스트 앞, 뒤에 삽입
| Markdown   | Result   |
| -          | -        |
| \`inline\` | `inline` |

# List
## Ordered List
적힌 숫자와는 상관없이 순서대로 번호가 매겨진다.
```markdown
1. One
1. Two
1. Three
```
output:
1. One
1. Two
1. Three

## Unordered List
`*`, `+` 그리고 `-`가 사용되며, 혼합되어 사용이 가능하다.
```markdown
* Parent
  * Child
+ Parent
  + Child
- Parent
  - Child
* Parent
  + Child
    - Grand Child
```
output:
* Parent
  * Child
+ Parent
  + Child
- Parent
  - Child
* Parent
  + Child
    - Grand Child

# Horizontal Rule
| Markdown | Result |
| -        | -      |
| ---      | <hr>   |
| ***      | <hr>   |
| ___      | <hr>   |

# Link

## External Link
바로 링크 주소를 작성해도 되지만, 텍스트에 링크를 참조시킬 수 있다.
| Markdown | Result |
| -        | -      |
| [Google\](http://www.google.co.kr "구글") | [Google](http://www.google.co.kr "구글") |
| [Google\][1\]<br><br>\[1]: http://www.google.co.kr "구글" | [Google][1]<br><br> |

[1]: http://www.google.co.kr "구글"

## Internal Link
Anchor 포인트를 html로 지정하는 방법  
`<a name="anchor"></a>`

| Markdown | Result |
| -        | -      |
| [Link to Header\](#Header) | [Link to Header](#Header) |
| [Link to Top\](#top) | [Link to Top](#top) |
| [Link to Bottom\](#bottom) | [Link to Bottom](#bottom) |

# Image
| Markdown | Result |
| -        | -      |
| ![alt text\](/test.png) | ![alt text](/test.png) |
| ![alt text\](image_url) | ![alt text](/test.png) |
| ![alt text\](#image)<br><br>[image]: /test/png | ![alt text](/test.png) |

# Footnote
각주입니다[^id]  
[^id]: 각주에 대한 설명.

# Blockquote
| Markdown | Result |
| -        | -      |
| > text | <blockquote>text</blockquote>|
| > text<br>> text |<blockquote>text<br><blockquote>text</blockquote></blockquote>|



<a name="bottom"></a>
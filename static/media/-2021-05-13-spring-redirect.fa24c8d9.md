MVC 리다이렉트
```java
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;


@Controller
public class ExRedirectController {
   // return string
   @GetMapping("/ex_redirect1")
   public String exRedirect1() {
       return "redirect:http://www.naver.com";
   }
   // return ModelAndView
   @GetMapping("/ex_redirect2")
   public ModelAndView exRedirect2() {
       String projectUrl = "redirect:http://www.naver.com";
       return new ModelAndView("redirect:" + projectUrl);
   }
   
   // httpServletResponse.sendRedirect
   @GetMapping("/ex_redirect3")
   public void exRedirect3(HttpServletResponse httpServletResponse) throws IOException {
       httpServletResponse.sendRedirect("https://naver.com");
   }
   
   // RedirectView 
   @RequestMapping("/ex_redirect4")
   public RedirectView exRedirect4() {
       RedirectView redirectView = new RedirectView();
       redirectView.setUrl("http://www.naver.com");
       return redirectView;
   }
   
   // httpHeaders
   @RequestMapping("/ex_redirect5")
   public ResponseEntity<Object> exRedirect5() throws URISyntaxException {
       URI redirectUri = new URI("http://www.naver.com");
       HttpHeaders httpHeaders = new HttpHeaders();
       httpHeaders.setLocation(redirectUri);
       return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
   }
}
```
리다이렉트 vs 포워드
http://jonggs.blogspot.com/2018/11/spring-redirect-forward.html
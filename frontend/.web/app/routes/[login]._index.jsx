import {Fragment,useCallback,useContext,useEffect} from "react"
import {Box as RadixThemesBox,Button as RadixThemesButton,Flex as RadixThemesFlex,Heading as RadixThemesHeading,Link as RadixThemesLink,Text as RadixThemesText,TextField as RadixThemesTextField} from "@radix-ui/themes"
import {ReflexEvent,isNotNullOrUndefined,refs} from "$/utils/state"
import {Toaster,toast} from "sonner"
import {ColorModeContext,EventLoopContext,StateContexts} from "$/utils/context"
import {Wallet as LucideWallet} from "lucide-react"
import DebounceInput from "react-debounce-input"
import {Link as ReactRouterLink} from "react-router"
import {jsx} from "@emotion/react"




function Toaster_11b04b7ca7e917be1c8df8032e226c05 () {
  const { resolvedColorMode } = useContext(ColorModeContext)
refs['__toast'] = toast


  return (
    jsx(Toaster,{closeButton:false,expand:true,position:"bottom-right",richColors:true,theme:resolvedColorMode},)
  )
}


function Debounceinput_6d5da89db2e055445825ed0eb8b246dc () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_00e8c47d95ad97619639ee2ab7e10f6f = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_login_name", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["background"] : "rgba(255, 255, 255, 0.1)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["color"] : "#fff", ["borderRadius"] : "10px", ["paddingLeft"] : "15px", ["paddingRight"] : "15px", ["height"] : "45px", ["transition"] : "0.3s", ["width"] : "100%", ["outline"] : "none", ["fontSize"] : "0.95rem", ["&:focus"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["boxShadow"] : "0 0 10px rgba(0, 198, 255, 0.3)", ["border"] : "1px solid #00c6ff" }), ["&:placeholder"] : ({ ["color"] : "rgba(255, 255, 255, 0.4)" }) }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_00e8c47d95ad97619639ee2ab7e10f6f,placeholder:"Nh\u1eadp username",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.login_name_rx_state_) ? reflex___state____state__spendee___app_state____app_state.login_name_rx_state_ : "")},)
  )
}


function Debounceinput_fdb941a82054dd0db5f01424ba3a5a53 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_1cb340d02501da172ae5d6e4789df278 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_login_password", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["background"] : "rgba(255, 255, 255, 0.1)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["color"] : "#fff", ["borderRadius"] : "10px", ["paddingLeft"] : "15px", ["paddingRight"] : "15px", ["height"] : "45px", ["transition"] : "0.3s", ["width"] : "100%", ["outline"] : "none", ["fontSize"] : "0.95rem", ["&:focus"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["boxShadow"] : "0 0 10px rgba(0, 198, 255, 0.3)", ["border"] : "1px solid #00c6ff" }), ["&:placeholder"] : ({ ["color"] : "rgba(255, 255, 255, 0.4)" }) }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_1cb340d02501da172ae5d6e4789df278,placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",type:"password",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.login_password_rx_state_) ? reflex___state____state__spendee___app_state____app_state.login_password_rx_state_ : "")},)
  )
}


function Button_b183047ff9d7bafd201fd3131753c804 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_f43536e4a469bcf957fa7e6db3508440 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.login", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "linear-gradient(45deg, #00c6ff, #0072ff)", ["border"] : "none", ["borderRadius"] : "10px", ["transition"] : "0.3s", ["fontWeight"] : "600", ["letterSpacing"] : "0.5px", ["marginTop"] : "10px", ["width"] : "100%", ["padding"] : "20px 0", ["color"] : "#fff", ["&:hover"] : ({ ["transform"] : "translateY(-3px)", ["boxShadow"] : "0 5px 15px rgba(0, 198, 255, 0.4)", ["cursor"] : "pointer" }) }),loading:reflex___state____state__spendee___app_state____app_state.loading_rx_state_,onClick:on_click_f43536e4a469bcf957fa7e6db3508440},"\u0110\u0103ng nh\u1eadp")
  )
}


export default function Component() {





  return (
    jsx(Fragment,{},jsx(RadixThemesFlex,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["justifyContent"] : "center", ["width"] : "100%", ["height"] : "100vh" })},jsx(Toaster_11b04b7ca7e917be1c8df8032e226c05,{},),jsx(RadixThemesBox,{css:({ ["width"] : "100%", ["maxWidth"] : "420px", ["borderRadius"] : "20px", ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["boxShadow"] : "0 10px 40px rgba(0,0,0,0.3)", ["padding"] : "30px", ["animation"] : "fadeIn 0.6s ease-in-out", ["@keyframes fadeIn"] : ({ ["0%"] : ({ ["opacity"] : "0", ["transform"] : "translateY(20px)" }), ["100%"] : ({ ["opacity"] : "1", ["transform"] : "translateY(0)" }) }) })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["alignItems"] : "center" }),direction:"column",gap:"3"},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["marginBottom"] : "6" }),direction:"column",gap:"3"},jsx(LucideWallet,{css:({ ["color"] : "#00c6ff" }),size:40},),jsx(RadixThemesHeading,{css:({ ["fontWeight"] : "bold", ["color"] : "white", ["marginTop"] : "2" }),size:"6"},"Persional Budget"),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)", ["fontWeight"] : "300", ["fontSize"] : "0.9rem" })},"Ch\u00e0o m\u1eebng tr\u1edf l\u1ea1i")),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["alignItems"] : "start" }),direction:"column",gap:"1"},jsx(RadixThemesText,{as:"p",css:({ ["fontWeight"] : "300", ["fontSize"] : "0.9rem", ["color"] : "rgba(255, 255, 255, 0.8)", ["marginBottom"] : "5px", ["width"] : "100%" })},"T\u00ean \u0111\u0103ng nh\u1eadp"),jsx(Debounceinput_6d5da89db2e055445825ed0eb8b246dc,{},),jsx(RadixThemesText,{as:"p",css:({ ["fontWeight"] : "300", ["fontSize"] : "0.9rem", ["color"] : "rgba(255, 255, 255, 0.8)", ["marginBottom"] : "5px", ["width"] : "100%", ["marginTop"] : "3" })},"M\u1eadt kh\u1ea9u"),jsx(Debounceinput_fdb941a82054dd0db5f01424ba3a5a53,{},)),jsx(Button_b183047ff9d7bafd201fd3131753c804,{},),jsx(RadixThemesBox,{css:({ ["textAlign"] : "center", ["marginTop"] : "4" })},jsx(RadixThemesText,{as:"span",css:({ ["color"] : "rgba(255, 255, 255, 0.6)", ["fontSize"] : "0.9rem" })},"Ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n? "),jsx(RadixThemesLink,{asChild:true,css:({ ["color"] : "#00c6ff", ["fontWeight"] : "600", ["&:hover"] : ({ ["textDecoration"] : "underline", ["color"] : "#fff" }) })},jsx(ReactRouterLink,{to:"/register"},"\u0110\u0103ng k\u00fd")))))),jsx("title",{},"\u0110\u0103ng nh\u1eadp"),jsx("meta",{content:"favicon.ico",property:"og:image"},))
  )
}
import { createContext, useContext, useMemo, useReducer, useState, createElement, useEffect } from "react"
import { applyDelta, ReflexEvent, hydrateClientStorage, useEventLoop, refs } from "$/utils/state"
import { jsx } from "@emotion/react";

export const initialState = {"reflex___state____state": {"is_hydrated_rx_state_": false, "router_rx_state_": {"session": {"client_token": "", "client_ip": "", "session_id": ""}, "headers": {"host": "", "origin": "", "upgrade": "", "connection": "", "cookie": "", "pragma": "", "cache_control": "", "user_agent": "", "sec_websocket_version": "", "sec_websocket_key": "", "sec_websocket_extensions": "", "accept_encoding": "", "accept_language": "", "raw_headers": {}}, "page": {"host": "", "path": "", "raw_path": "", "full_path": "", "full_raw_path": "", "params": {}}, "url": "", "route_id": ""}}, "reflex___state____state.reflex___state____frontend_event_exception_state": {}, "reflex___state____state.reflex___state____on_load_internal_state": {}, "reflex___state____state.reflex___state____update_vars_internal_state": {}, "reflex___state____state.spendee___app_state____app_state": {"access_token_rx_state_": "", "ai_advice_rx_state_": "", "ai_loading_rx_state_": false, "b_amount_rx_state_": "", "b_category_id_rx_state_": "", "banner_rx_state_": "", "budgets_rx_state_": [], "c_color_rx_state_": "#1FC06A", "c_icon_rx_state_": "fa-tag", "c_name_rx_state_": "", "c_type_rx_state_": "EXPENSE", "categories_rx_state_": [], "chat_input_rx_state_": "", "chat_messages_rx_state_": [{"role": "assistant", "content": "Chào bạn! Mình là Persional Budget AI. Hỏi mình về tài chính nhé! 🤖"}], "filter_month_rx_state_": "4", "filter_year_rx_state_": "2026", "is_logged_in_rx_state_": false, "item_expenses_list_rx_state_": [], "item_incomes_list_rx_state_": [], "loading_rx_state_": false, "login_name_rx_state_": "", "login_password_rx_state_": "", "pending_receipt_tx_rx_state_": "", "refresh_token_rx_state_": "", "reg_email_rx_state_": "", "reg_name_rx_state_": "", "reg_password_rx_state_": "", "report_rx_state_": {"period_income": 0.0, "period_expenses": 0.0, "period_change": 0.0, "item_expenses": [], "item_incomes": []}, "report_change_display_rx_state_": "0.0", "report_expenses_display_rx_state_": "0.0", "report_income_display_rx_state_": "0.0", "s_category_id_rx_state_": "", "s_end_rx_state_": "", "s_note_rx_state_": "", "s_start_rx_state_": "", "s_wallet_id_rx_state_": "", "t_amount_rx_state_": "", "t_category_id_rx_state_": "", "t_date_rx_state_": "2026-04-10", "t_note_rx_state_": "", "t_wallet_id_rx_state_": "", "total_wallet_balance_rx_state_": 0.0, "tr_amount_rx_state_": "", "tr_from_rx_state_": "", "tr_to_rx_state_": "", "transactions_rx_state_": [], "uid_int_rx_state_": 0, "user_id_rx_state_": "", "username_rx_state_": "", "w_balance_rx_state_": "0", "w_color_rx_state_": "#1FC06A", "w_icon_rx_state_": "fa-wallet", "w_name_rx_state_": "", "wallets_rx_state_": []}}

export const defaultColorMode = "dark"
export const ColorModeContext = createContext(null);
export const UploadFilesContext = createContext(null);
export const DispatchContext = createContext(null);
export const StateContexts = {reflex___state____state: createContext(null),reflex___state____state__reflex___state____frontend_event_exception_state: createContext(null),reflex___state____state__reflex___state____on_load_internal_state: createContext(null),reflex___state____state__reflex___state____update_vars_internal_state: createContext(null),reflex___state____state__spendee___app_state____app_state: createContext(null),};
export const EventLoopContext = createContext(null);
export const clientStorage = {"cookies": {}, "local_storage": {"reflex___state____state.spendee___app_state____app_state.access_token_rx_state_": {"name": "qlct_access_token", "sync": true}, "reflex___state____state.spendee___app_state____app_state.refresh_token_rx_state_": {"name": "qlct_refresh_token", "sync": true}, "reflex___state____state.spendee___app_state____app_state.user_id_rx_state_": {"name": "qlct_user_id", "sync": true}, "reflex___state____state.spendee___app_state____app_state.username_rx_state_": {"name": "qlct_username", "sync": true}}, "session_storage": {}}


export const state_name = "reflex___state____state"

export const exception_state_name = "reflex___state____state.reflex___state____frontend_event_exception_state"

// These events are triggered on initial load and each page navigation.
export const onLoadInternalEvent = () => {
    const internal_events = [];

    // Get tracked cookie and local storage vars to send to the backend.
    const client_storage_vars = hydrateClientStorage(clientStorage);
    // But only send the vars if any are actually set in the browser.
    if (client_storage_vars && Object.keys(client_storage_vars).length !== 0) {
        internal_events.push(
            ReflexEvent(
                'reflex___state____state.reflex___state____update_vars_internal_state.update_vars_internal',
                {vars: client_storage_vars},
            ),
        );
    }

    // `on_load_internal` triggers the correct on_load event(s) for the current page.
    // If the page does not define any on_load event, this will just set `is_hydrated = true`.
    internal_events.push(ReflexEvent('reflex___state____state.reflex___state____on_load_internal_state.on_load_internal'));

    return internal_events;
}

// The following events are sent when the websocket connects or reconnects.
export const initialEvents = () => [
    ReflexEvent('reflex___state____state.hydrate'),
    ...onLoadInternalEvent()
]
    

export const isDevMode = true;

export function UploadFilesProvider({ children }) {
  const [filesById, setFilesById] = useState({})
  refs["__clear_selected_files"] = (id) => setFilesById(filesById => {
    const newFilesById = {...filesById}
    delete newFilesById[id]
    return newFilesById
  })
  return createElement(
    UploadFilesContext.Provider,
    { value: [filesById, setFilesById] },
    children
  );
}

export function ClientSide(component) {
  return ({ children, ...props }) => {
    const [Component, setComponent] = useState(null);
    useEffect(() => {
      async function load() {
        const comp = await component();
        setComponent(() => comp);
      }
      load();
    }, []);
    return Component ? jsx(Component, props, children) : null;
  };
}

export function EventLoopProvider({ children }) {
  const dispatch = useContext(DispatchContext)
  const [addEvents, connectErrors] = useEventLoop(
    dispatch,
    initialEvents,
    clientStorage,
  )
  return createElement(
    EventLoopContext.Provider,
    { value: [addEvents, connectErrors] },
    children
  );
}

export function StateProvider({ children }) {
  const [reflex___state____state, dispatch_reflex___state____state] = useReducer(applyDelta, initialState["reflex___state____state"])
const [reflex___state____state__reflex___state____frontend_event_exception_state, dispatch_reflex___state____state__reflex___state____frontend_event_exception_state] = useReducer(applyDelta, initialState["reflex___state____state.reflex___state____frontend_event_exception_state"])
const [reflex___state____state__reflex___state____on_load_internal_state, dispatch_reflex___state____state__reflex___state____on_load_internal_state] = useReducer(applyDelta, initialState["reflex___state____state.reflex___state____on_load_internal_state"])
const [reflex___state____state__reflex___state____update_vars_internal_state, dispatch_reflex___state____state__reflex___state____update_vars_internal_state] = useReducer(applyDelta, initialState["reflex___state____state.reflex___state____update_vars_internal_state"])
const [reflex___state____state__spendee___app_state____app_state, dispatch_reflex___state____state__spendee___app_state____app_state] = useReducer(applyDelta, initialState["reflex___state____state.spendee___app_state____app_state"])
  const dispatchers = useMemo(() => {
    return {
      "reflex___state____state": dispatch_reflex___state____state,
"reflex___state____state.reflex___state____frontend_event_exception_state": dispatch_reflex___state____state__reflex___state____frontend_event_exception_state,
"reflex___state____state.reflex___state____on_load_internal_state": dispatch_reflex___state____state__reflex___state____on_load_internal_state,
"reflex___state____state.reflex___state____update_vars_internal_state": dispatch_reflex___state____state__reflex___state____update_vars_internal_state,
"reflex___state____state.spendee___app_state____app_state": dispatch_reflex___state____state__spendee___app_state____app_state,
    }
  }, [])

  return (
    createElement(StateContexts.reflex___state____state,{value: reflex___state____state},
createElement(StateContexts.reflex___state____state__reflex___state____frontend_event_exception_state,{value: reflex___state____state__reflex___state____frontend_event_exception_state},
createElement(StateContexts.reflex___state____state__reflex___state____on_load_internal_state,{value: reflex___state____state__reflex___state____on_load_internal_state},
createElement(StateContexts.reflex___state____state__reflex___state____update_vars_internal_state,{value: reflex___state____state__reflex___state____update_vars_internal_state},
createElement(StateContexts.reflex___state____state__spendee___app_state____app_state,{value: reflex___state____state__spendee___app_state____app_state},
    createElement(DispatchContext, {value: dispatchers}, children)
    )))))
  )
}
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "../admin.module.css";

export default function ResetPassword(){
  const tokens=useRef<{accessToken:string;refreshToken:string}|null>(null);
  const [valid,setValid]=useState<boolean|null>(null);
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [feedback,setFeedback]=useState("");
  useEffect(()=>{const hash=new URLSearchParams(window.location.hash.slice(1));const accessToken=hash.get("access_token");const refreshToken=hash.get("refresh_token");if(accessToken&&refreshToken){tokens.current={accessToken,refreshToken};setValid(true);}else if(!tokens.current)setValid(false);window.history.replaceState(null,"",window.location.pathname+window.location.search);},[]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=new FormData(e.currentTarget);const password=String(form.get("password"));if(password!==form.get("confirmation")){setFeedback("As senhas precisam ser iguais.");return;}if(!tokens.current){setFeedback("O link está incompleto. Solicite uma nova recuperação.");return;}setBusy(true);setFeedback("");try{const response=await fetch("/api/auth/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...tokens.current,password})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Não foi possível atualizar sua senha.");tokens.current=null;setDone(true);}catch(error){setFeedback((error as Error).message);}finally{setBusy(false);}}
  return <main className={styles.login}>{done?<div className={styles.resetSuccess}><h1>Senha atualizada.</h1><p>Entre novamente com sua nova senha.</p><a className="button" href="/admin" style={{marginTop:25}}>Ir para o login ↗</a></div>:<><h1>Um novo acesso.</h1><p>Escolha uma senha com pelo menos 12 caracteres.</p>{valid===null?<p>Conferindo o link…</p>:valid?<form onSubmit={submit}><label>Nova senha<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><label>Repita a nova senha<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required/></label><button className="button full" disabled={busy}>{busy?"Atualizando…":"Salvar nova senha"}</button></form>:<p>Este link está incompleto ou já foi utilizado. Volte ao login e solicite uma nova recuperação.</p>}<p className={styles.feedback} role="status">{feedback}</p><a className={styles.link} href="/admin">Voltar para o login</a></>}</main>;
}

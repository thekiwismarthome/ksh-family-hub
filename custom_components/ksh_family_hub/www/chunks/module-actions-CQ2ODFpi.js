function t(t){const n=t.hubActions,i=JSON.stringify(n);i!==t._actionsKey&&(t._actionsKey=i,t.dispatchEvent(new CustomEvent("module-actions-changed",{detail:{actions:n}})))}export{t as p};

const app = document.getElementById("app");

const pools = {
  alpha: "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ",
  num: "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789",
  sym: "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789!£$%^&*()_+-{}:@?[];#,.",
}
const poolNames = {
  alpha: "Alpha",
  num: "Alpha-numeric",
  sym: "Alpha-numeric + symbols",
}


const genPassword = (pool, len) => {
  let array = new Uint32Array(len);
  window.crypto.getRandomValues(array);
  let password = "";
  let nums = "";
  for (let i = 0; i < array.length; i++) {
    password += pool[array[i] % pool.length];
    nums += array[i] % pool.length + ",";
  }
  return password;
}

const copyPassword = (pool, len) => {
  return () => {
    let a = document.createElement("input");
    a.value = genPassword(pool, len);
    app.appendChild(a);
    a.select();
    document.execCommand("Copy");
    app.removeChild(a);
    window.close();
  }
}

for (let c of ["alpha", "num", "sym"]) {
  let a = document.createElement("div");
  a.innerText = poolNames[c];
  app.appendChild(a);

  let count = document.createElement("div");
  for (let i = 8; i <= 32; i += 4) {
    let e = document.createElement("button");
    e.innerText = i;
    e.onclick = copyPassword(pools[c], i);
    count.appendChild(e);
  }
  app.appendChild(count);
}

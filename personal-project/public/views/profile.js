fetch("/profile")
      .then(res => res.json())
      .then(user => {
        document.getElementById("userInfo").innerHTML = `
          <h2>${user.name}</h2>
          <img src="${user.photo}" width="100">
          <p>Email: ${user.email}</p>
        `;
      })
      .catch(() => window.location.href = "/login");
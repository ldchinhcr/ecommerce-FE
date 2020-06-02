

const checkToken = async () => {
    let accessToken = localStorage.getItem("token");
    let refreshToken = localStorage.getItem("refreshToken");
    const queryToken = accessToken || refreshToken;
    if (!queryToken) return;
    if (accessToken || refreshToken) {
      const resJson = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const res = await resJson.json();
      if (res && res.status === true) {
        return;
      } else {
        if (refreshToken) {
          const response = await fetch(
            process.env.REACT_APP_SERVER + "/auth/refresh-token",
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken: refreshToken }),
            }
          );
          const data = await response.json();
          if (data.status === true) {
            localStorage.setItem("token", data.token);
            checkToken();
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        } else {
          localStorage.removeItem("token");
        }
      }
    }
  };

export default checkToken;
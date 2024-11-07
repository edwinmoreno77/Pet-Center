import { useContext } from "react";
import { Context } from "../store/appContext";
import Swal from "sweetalert2";

export const useAuth = () => {
  const { actions } = useContext(Context);
  const { onChecking, onLogin, onLogout } = actions;

  // REVALIDAR TOKEN - LOGIN MODIFICADO------------------
  const authLogin = async (email, password) => {
    onChecking();

    try {
      const response = await fetch("http://localhost:5004/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: "Email o contraseña son inválidos",
        });
        onLogout();
        return;
      }

      const result = await response.json();
      const { data: user, token } = result;

      // Guardar el token y la fecha de creación del token en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-date", new Date().getTime());

      // Guardar también los datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);

      return result;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      onLogout();
    }
  };

  // REVALIDAR TOKEN- FUNCIÓN REVALIDAR TOKEN--------------------

  const revalidateToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      onLogout();
      return;
    }

    try {
      const response = await fetch("http://localhost:5004/renew", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        onLogout();
        return;
      }

      const { user, newToken } = await response.json();

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token-init-date", new Date().getTime());

      onLogin({
        id: user.id,
        rut: user.rut,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        direction: user.direction,
        comuna: user.comuna,
        region: user.region,
        cellphone: user.cellphone,
        image: user.image,
        pets: user.owned_pets,
      });
    } catch (error) {
      console.error("Error revalidando el token:", error);
      onLogout();
    }
  };

  const createUser = async (userData) => {
    try {
      onChecking();
      const response = await fetch("http://localhost:5004/createUser", {
        method: "POST",
        body: userData,
      });

      if (!response.ok) {
        if (response.status == 409) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El Usuario ya existe",
          });
          onLogout();
          return false;
        } else {
          throw new Error(`message: ${response.statusText}`);
        }
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("token-init-date", new Date().getTime());

      onLogin({
        id: user.id,
        rut: user.rut,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        direction: user.direction,
        comuna: user.comuna,
        region: user.region,
        cellphone: user.cellphone,
        image: user.image,
        pets: user.owned_pets,
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Nueva cuenta creada!",
        showConfirmButton: false,
        timer: 2000,
      });
      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      onLogout(error);
      console.log(error);
      return error;
    }
  };

  // const authLogin = async (email, password) => {
  //   onChecking();

  //   try {
  //     let url = `http://localhost:5004/login`;
  //     let options = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     };

  //     let response = await fetch(url, options);

  //     if (!response.ok) {
  //       if (response.status === 401) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error de autenticación",
  //           text: "Email o contraseña son inválidos",
  //         });
  //         onLogout();
  //         return;
  //       } else {
  //         throw new Error(`message: ${response.statusText}`);
  //       }
  //     }

  //     let result = await response.json();
  //     const { data: user, token } = result;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("token-init-date", new Date().getTime());

  //     onLogin({
  //       id: user.id,
  //       rut: user.rut,
  //       name: user.name,
  //       lastName: user.lastName,
  //       email: user.email,
  //       direction: user.direction,
  //       comuna: user.comuna,
  //       region: user.region,
  //       cellphone: user.cellphone,
  //       image: user.image,
  //       pets: user.owned_pets,
  //     });

  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: error,
  //     });
  //     onLogout(error);
  //   }
  // };

  const updateUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:5004/updateUser", {
        method: "POST",
        body: userData,
      });

      if (!response.ok) {
        if (response.status == 409) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El email ya existe",
          });
          return false;
        } else {
          throw new Error(`message: ${response.statusText}`);
        }
      }

      const data = await response.json();
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("token-init-date", new Date().getTime());

      onLogin({
        id: user.id,
        rut: user.rut,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        direction: user.direction,
        comuna: user.comuna,
        region: user.region,
        cellphone: user.cellphone,
        image: user.image,
        pets: user.owned_pets,
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cambios guardados",
        showConfirmButton: false,
        timer: 2000,
      });
      return user;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      console.log(error);
      return error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#757575",
        confirmButtonText: "Sí, eliminar!",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:5004/deleteUser/${id}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`message: ${response.statusText}`);
        }
        const data = await response.json();

        Swal.fire({
          title: "Eliminado!",
          text: "Tu cuenta ha sido eliminada.",
          icon: "success",
        });
        onLogout();
        return data;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      console.log(error);
      return error;
    }
  };

  return {
    authLogin,
    revalidateToken,
    createUser,
    updateUser,
    deleteUser,
  };
};

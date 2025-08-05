import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ManagePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin", { replace: true });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p>
        This page is provided for compatibility with Isatidia's frontend
        program.
      </p>
      <p>
        If you are looking for the admin panel, please go to{" "}
        <a href="/admin">/admin</a>.
      </p>
    </div>
  );
};

export default ManagePage;

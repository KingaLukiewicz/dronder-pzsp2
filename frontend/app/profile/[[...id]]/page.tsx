"use client";
import { useState, useEffect } from "react";
import Header from "@/app/components/header/page";
import Sidebar from "@/app/components/sidebar/page";
import styles from "./page.module.css";
import ReviewBox from "@/app/components/review_box/page";
import { Tooltip, Rating } from "@mui/material";
import { UserdataGet } from "@/app/types";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter, useParams } from "next/navigation";
import { BASE_URL } from "@/app/constants";

export default function Profile() {
  const params = useParams();
  const userId = params.id?.[0];
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [userData, setUserData] = useState<UserdataGet | null>(null);
  const totalReviews = userData?.reviews?.length ?? 0;
  const averageRating =
    totalReviews > 0
      ? userData!.reviews!.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleEdit = () => {
    router.push("/profile_form");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena. Zaloguj się ponownie.");
        }
        const url = userId
          ? `${BASE_URL}/user/data/${userId}`
          : `${BASE_URL}/user/data`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Backend returned non-JSON:", text);
          throw new Error(`Błąd backendu: ${res.status}`);
        }
        const data: UserdataGet = await res.json();
        sessionStorage.setItem("role", data.role);
        if (data.role === "admin") {
          router.push("/admin");
        }
        sessionStorage.setItem("email", data.email);
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className={styles.Profile}>
      <Header toggleSidebar={toggleSidebar} />
      {sidebarVisible && <Sidebar />}
      <main style={{ marginLeft: sidebarVisible ? "27vw" : "7vw" }}>
        {userId ? (
          <h1>{`Profil ${userData?.username}`}</h1>
        ) : (
          <h1>Mój profil</h1>
        )}
        {userData && (
          <>
            <div className={styles.InfoContainer}>
              <div className={styles.EditIcon} onClick={handleEdit}>
                <EditIcon />
              </div>
              <div className={styles.Info}>
                <h2>{userData.username}</h2>
                <p>{userData.description}</p>
                {userData.role === "operator" && userData.location && (
                  <>
                    <h3>Lokalizacja</h3>
                    <p>Adres: {userData.location.address}</p>
                    <p>Zasięg: {userData.location.radius} km</p>
                  </>
                )}
                {userData.role === "operator" &&
                  userData.products.length > 0 && (
                    <>
                      <h3>Oferowane produkty</h3>
                      <ul>
                        {userData.products.map((product, index) => (
                          <li key={index}>{product}</li>
                        ))}
                      </ul>
                    </>
                  )}
                {userData.reviews && (
                  <>
                    <div className={styles.Rating}>
                      <div className={styles.StarRating}>
                        <Tooltip placement="top" title={averageRating}>
                          <span>
                            <Rating
                              name="read-only"
                              value={averageRating}
                              precision={0.1}
                              readOnly
                            />
                          </span>
                        </Tooltip>
                      </div>
                      <p>{`${totalReviews} oceny`}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        <h2>OPINIE</h2>
        <select
          className={styles.Select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">-- Sortuj według --</option>
          <option value="new">Od najnowszych</option>
          <option value="best">Od najlepszych</option>
          <option value="worst">Od najgorszych</option>
        </select>
        <div className={styles.Reviews}>
          <ReviewBox />
        </div>
      </main>
    </div>
  );
}

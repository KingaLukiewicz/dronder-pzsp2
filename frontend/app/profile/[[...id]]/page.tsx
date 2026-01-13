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
import { useMemo } from "react";

export default function Profile() {
  const params = useParams();
  const userId = params.id?.[0];
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [userData, setUserData] = useState<UserdataGet | null>(null);
  const [weekdays, setWeekdays] = useState<Record<string, boolean> | null>(
    null
  );
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
  const sortedReviews = useMemo(() => {
    if (!userData?.reviews) return [];

    const reviews = [...userData.reviews];

    switch (sortBy) {
      case "new":
        return reviews.sort((a, b) => {
          const dateA = a.review_date ? new Date(a.review_date).getTime() : 0;

          const dateB = b.review_date ? new Date(b.review_date).getTime() : 0;

          return dateB - dateA; // newest first
        });

      case "best":
        return reviews.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case "worst":
        return reviews.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));

      default:
        return reviews;
    }
  }, [userData?.reviews, sortBy]);

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
  }, [userId, router]);

  useEffect(() => {
    const fetchWeekdays = async () => {
      if (!userData?.user_id) return;
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Brak tokena. Zaloguj się ponownie.");

        const res = await fetch(
          `${BASE_URL}/user/weekdays/${userData?.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Backend returned non-JSON:", text);
          throw new Error(`Błąd backendu: ${res.status}`);
        }

        const data: Record<string, boolean> = await res.json();

        const orderedDays = [
          "Poniedziałek",
          "Wtorek",
          "Środa",
          "Czwartek",
          "Piątek",
          "Sobota",
          "Niedziela",
        ];
        const initialWeekdays: Record<string, boolean> = {};
        orderedDays.forEach((day) => {
          initialWeekdays[day] = !!data[day];
        });

        setWeekdays(initialWeekdays);
      } catch (err) {
        console.error("Failed to fetch weekdays:", err);
      }
    };

    if (userData?.role === "operator") fetchWeekdays();
  }, [userData?.role, userData?.user_id]);

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

                {userData.role === "operator" && weekdays && (
                  <>
                    <h3>Dostępność czasowa</h3>
                    <ul className={styles.WeekdaysList}>
                      {[
                        "Poniedziałek",
                        "Wtorek",
                        "Środa",
                        "Czwartek",
                        "Piątek",
                        "Sobota",
                        "Niedziela",
                      ].map((day) => (
                        <li key={day}>
                          {day}: {weekdays[day] ? "Dostępny" : "Niedostępny"}
                        </li>
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
                      <p>
                        {totalReviews}{" "}
                        {totalReviews === 1
                          ? "ocena"
                          : totalReviews % 10 >= 2 &&
                            totalReviews % 10 <= 4 &&
                            !(
                              totalReviews % 100 >= 12 &&
                              totalReviews % 100 <= 14
                            )
                          ? "oceny"
                          : "ocen"}
                      </p>
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
          <option value="">--Sortuj według--</option>
          <option value="new">Od najnowszych</option>
          <option value="best">Od najlepszych</option>
          <option value="worst">Od najgorszych</option>
        </select>
        <div className={styles.Reviews}>
          {sortedReviews.length === 0 ? (
            <p>Ten użytkownik nie ma jeszcze opinii</p>
          ) : (
            sortedReviews.map((review, index) => (
              <ReviewBox key={index} review={review} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

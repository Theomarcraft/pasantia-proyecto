<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     title="API Citas Médicas - UNIR S.A.",
 *     version="1.0.0",
 *     description="API REST para la gestión de usuarios, doctores, servicios y citas médicas.
 *     <br>Desarrollado como parte del sistema de citas médicas de **UNIR S.A.**.",
 *     @OA\Contact(
 *         name="Soporte Técnico",
 *         email="soporte@unirsa.com"
 *     )
 * )
 *
 * @OA\Server(
 *     url="http://127.0.0.1:8000",
 *     description="Servidor local de desarrollo"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Autenticación mediante token de acceso Bearer (Sanctum)"
 * )
 */

/**
 * @OA\Schema(
 *     schema="Appointment",
 *     type="object",
 *     title="Cita médica",
 *     required={"doctor_id", "user_id", "appointment_date", "description"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="doctor_id", type="integer", example=3),
 *     @OA\Property(property="user_id", type="integer", example=5),
 *     @OA\Property(property="appointment_date", type="string", format="date-time", example="2025-09-30 10:00:00"),
 *     @OA\Property(property="description", type="string", example="Consulta general"),
 *     @OA\Property(property="status", type="string", example="pendiente")
 * )
 */
class SwaggerDefinition {}

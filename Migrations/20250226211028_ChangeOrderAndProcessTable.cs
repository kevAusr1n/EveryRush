using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations
{
    /// <inheritdoc />
    public partial class ChangeOrderAndProcessTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateAt",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Processes",
                newName: "ToUserId");

            migrationBuilder.RenameColumn(
                name: "InitiatorId",
                table: "Processes",
                newName: "ToOrderStatus");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Processes",
                newName: "CreateAt");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FromOrderStatus",
                table: "Processes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FromUserId",
                table: "Processes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Orders",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Orders",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Orders",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Orders",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Orders",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromOrderStatus",
                table: "Processes");

            migrationBuilder.DropColumn(
                name: "FromUserId",
                table: "Processes");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "ToUserId",
                table: "Processes",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "ToOrderStatus",
                table: "Processes",
                newName: "InitiatorId");

            migrationBuilder.RenameColumn(
                name: "CreateAt",
                table: "Processes",
                newName: "Date");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Products",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateAt",
                table: "Orders",
                type: "datetime(6)",
                nullable: true);
        }
    }
}

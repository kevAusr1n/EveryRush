using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations
{
    /// <inheritdoc />
    public partial class ChangeOrderAndProcessTable1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppFiles_Processes_ProcessId",
                table: "AppFiles");

            migrationBuilder.DropTable(
                name: "Processes");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrderProcesses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Event = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Comment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FromOrderStatus = table.Column<int>(type: "int", nullable: true),
                    ToOrderStatus = table.Column<int>(type: "int", nullable: true),
                    FromUserId = table.Column<int>(type: "int", nullable: true),
                    ToUserId = table.Column<int>(type: "int", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderProcesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderProcesses_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_OrderProcesses_OrderId",
                table: "OrderProcesses",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppFiles_OrderProcesses_ProcessId",
                table: "AppFiles",
                column: "ProcessId",
                principalTable: "OrderProcesses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppFiles_OrderProcesses_ProcessId",
                table: "AppFiles");

            migrationBuilder.DropTable(
                name: "OrderProcesses");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Orders");

            migrationBuilder.CreateTable(
                name: "Processes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Event = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FromOrderStatus = table.Column<int>(type: "int", nullable: true),
                    FromUserId = table.Column<int>(type: "int", nullable: true),
                    ToOrderStatus = table.Column<int>(type: "int", nullable: true),
                    ToUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Processes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Processes_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Processes_OrderId",
                table: "Processes",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppFiles_Processes_ProcessId",
                table: "AppFiles",
                column: "ProcessId",
                principalTable: "Processes",
                principalColumn: "Id");
        }
    }
}

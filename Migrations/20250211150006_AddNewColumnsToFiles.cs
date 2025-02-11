using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations
{
    /// <inheritdoc />
    public partial class AddNewColumnsToFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Format",
                table: "AppFiles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AppFiles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Format",
                table: "AppFiles");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AppFiles");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EveryRush.Migrations.ProductDb
{
    /// <inheritdoc />
    public partial class AddOwnerIdToProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Products");
        }
    }
}

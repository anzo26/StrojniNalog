using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace StrojniNalog.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Stroji",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Oznaka = table.Column<string>(type: "text", nullable: false),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    Razpolozljiv = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stroji", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Uporabniki",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AuthId = table.Column<string>(type: "text", nullable: false),
                    Ime = table.Column<string>(type: "text", nullable: false),
                    Priimek = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Uporabniki", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VrsteStoritev",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    Aktivna = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VrsteStoritev", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Narocila",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NarocnikId = table.Column<int>(type: "integer", nullable: false),
                    VrstaStoritveId = table.Column<int>(type: "integer", nullable: false),
                    OpisDela = table.Column<string>(type: "text", nullable: false),
                    Lokacija = table.Column<string>(type: "text", nullable: false),
                    ZeleniTermin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DatumOddaje = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    RazlogZavrnitve = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Narocila", x => x.Id);
                    table.CheckConstraint("CK_Narocila_RazlogZavrnitve", "\"Status\" <> 'ZAVRNJENO' OR (\"RazlogZavrnitve\" IS NOT NULL AND length(trim(\"RazlogZavrnitve\")) > 0)");
                    table.CheckConstraint("CK_Narocila_Status", "\"Status\" IN ('ODDANO', 'POTRJENO', 'ZAVRNJENO')");
                    table.ForeignKey(
                        name: "FK_Narocila_Uporabniki_NarocnikId",
                        column: x => x.NarocnikId,
                        principalTable: "Uporabniki",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Narocila_VrsteStoritev_VrstaStoritveId",
                        column: x => x.VrstaStoritveId,
                        principalTable: "VrsteStoritev",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DelovniNalogi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NarociloId = table.Column<int>(type: "integer", nullable: false),
                    StrojId = table.Column<int>(type: "integer", nullable: false),
                    IzvajalecId = table.Column<int>(type: "integer", nullable: false),
                    PredvideniZacetek = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PredvideniKonec = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DejanskiZacetek = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DejanskiKonec = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OpravljeneUre = table.Column<decimal>(type: "numeric", nullable: true),
                    OpisIzvedbe = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    RazlogDopolnitve = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DelovniNalogi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DelovniNalogi_Narocila_NarociloId",
                        column: x => x.NarociloId,
                        principalTable: "Narocila",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DelovniNalogi_Stroji_StrojId",
                        column: x => x.StrojId,
                        principalTable: "Stroji",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DelovniNalogi_Uporabniki_IzvajalecId",
                        column: x => x.IzvajalecId,
                        principalTable: "Uporabniki",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DelovniNalogi_IzvajalecId",
                table: "DelovniNalogi",
                column: "IzvajalecId");

            migrationBuilder.CreateIndex(
                name: "IX_DelovniNalogi_NarociloId",
                table: "DelovniNalogi",
                column: "NarociloId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DelovniNalogi_StrojId",
                table: "DelovniNalogi",
                column: "StrojId");

            migrationBuilder.CreateIndex(
                name: "IX_Narocila_NarocnikId",
                table: "Narocila",
                column: "NarocnikId");

            migrationBuilder.CreateIndex(
                name: "IX_Narocila_VrstaStoritveId",
                table: "Narocila",
                column: "VrstaStoritveId");

            migrationBuilder.CreateIndex(
                name: "IX_Stroji_Oznaka",
                table: "Stroji",
                column: "Oznaka",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Uporabniki_AuthId",
                table: "Uporabniki",
                column: "AuthId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DelovniNalogi");

            migrationBuilder.DropTable(
                name: "Narocila");

            migrationBuilder.DropTable(
                name: "Stroji");

            migrationBuilder.DropTable(
                name: "Uporabniki");

            migrationBuilder.DropTable(
                name: "VrsteStoritev");
        }
    }
}
